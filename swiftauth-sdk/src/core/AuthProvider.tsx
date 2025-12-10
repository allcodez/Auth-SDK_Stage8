import React, { useEffect, useState, ReactNode, useMemo } from 'react';
import { Platform } from 'react-native';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';

// Firebase Auth
import {
  getAuth,
  initializeAuth,
  onAuthStateChanged,
  inMemoryPersistence,
  User as FirebaseUser,
  Auth as FirebaseAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithCredential,
} from 'firebase/auth';

// The Hack: Import for getReactNativePersistence
import * as firebaseAuth from 'firebase/auth';
// @ts-ignore
const getReactNativePersistence = (firebaseAuth as any).getReactNativePersistence;

import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// PROPER GOOGLE SIGN-IN
import { GoogleSignin } from '@react-native-google-signin/google-signin';

// Apple Sign-In (Expo)
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';

import { mapFirebaseError } from '../errors';
import { AuthContext } from './AuthContext';
import { AuthConfig, AuthStatus, User, AuthError, AuthErrorCode } from '../types';

interface AuthProviderProps {
  config: AuthConfig;
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ config, children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>(AuthStatus.LOADING);
  const [error, setError] = useState<AuthError | null>(null);
  const [firebaseAuthInstance, setFirebaseAuthInstance] = useState<FirebaseAuth | null>(null);

  // ✅ NEW: Explicit loading state for initial app load vs action loading
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    let app: FirebaseApp;
    let auth: FirebaseAuth;

    if (!getApps().length) {
      // 1. Initialize App
      app = initializeApp({
        apiKey: config.apiKey,
        authDomain: config.authDomain,
        projectId: config.projectId,
        storageBucket: config.storageBucket,
        messagingSenderId: config.messagingSenderId,
        appId: config.appId,
      });

      // 2. Select Persistence Strategy
      const selectedPersistence = config.persistence === 'memory'
        ? inMemoryPersistence
        : getReactNativePersistence(ReactNativeAsyncStorage);

      // 3. Initialize Auth
      auth = initializeAuth(app, {
        persistence: selectedPersistence
      });

    } else {
      app = getApp();
      auth = getAuth(app);
    }

    setFirebaseAuthInstance(auth);

    // 4. Configure Google Sign-In if enabled
    if (config.enableGoogle && config.googleWebClientId) {
      try {
        GoogleSignin.configure({
          webClientId: config.googleWebClientId,
          offlineAccess: true,
          iosClientId: config.googleIOSClientId, // Optional
        });
        console.log('✅ Google Sign-In configured successfully');
      } catch (err) {
        console.error('❌ Google Sign-In configuration failed:', err);
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      try {
        if (fbUser) {
          try {
            // Force token refresh to ensure validity on load
            const token = await fbUser.getIdToken(true);
            setUser({
              uid: fbUser.uid,
              email: fbUser.email,
              displayName: fbUser.displayName,
              photoURL: fbUser.photoURL,
              emailVerified: fbUser.emailVerified,
              token: token
            });
            setStatus(AuthStatus.AUTHENTICATED);
          } catch (tokenError: any) {
            console.error('Token retrieval error:', tokenError);
            if (tokenError.code === 'auth/user-token-expired' || tokenError.code === 'auth/null-user') {
              setStatus(AuthStatus.TOKEN_EXPIRED);
            } else {
              setStatus(AuthStatus.UNAUTHENTICATED);
            }
            setUser(null);
          }
        } else {
          setUser(null);
          setStatus(AuthStatus.UNAUTHENTICATED);
        }
      } catch (err) {
        console.error("Auth State Error:", err);
        setStatus(AuthStatus.UNAUTHENTICATED);
      } finally {
        // ✅ Stop initial loading spinner once Firebase has checked storage
        setIsDataLoading(false);
      }
    }, (err) => {
      console.error("Auth State Error:", err);
      setStatus(AuthStatus.UNAUTHENTICATED);
      setIsDataLoading(false);
    });

    return () => unsubscribe();
  }, [config]);

  // Email/Password Sign In
  const signInWithEmail = async (email: string, pass: string) => {
    if (!firebaseAuthInstance) return;
    try {
      setError(null);
      setStatus(AuthStatus.LOADING);
      await signInWithEmailAndPassword(firebaseAuthInstance, email, pass);
    } catch (err) {
      const mappedError = mapFirebaseError(err);
      setError(mappedError);
      setStatus(AuthStatus.UNAUTHENTICATED);
      throw mappedError;
    }
  };

  // Email/Password Sign Up
  const signUpWithEmail = async (email: string, pass: string) => {
    if (!firebaseAuthInstance) return;
    try {
      setError(null);
      setStatus(AuthStatus.LOADING);
      await createUserWithEmailAndPassword(firebaseAuthInstance, email, pass);
    } catch (err) {
      const mappedError = mapFirebaseError(err);
      setError(mappedError);
      setStatus(AuthStatus.UNAUTHENTICATED);
      throw mappedError;
    }
  };

  // PROPER GOOGLE SIGN-IN using @react-native-google-signin/google-signin
  const signInWithGoogle = async () => {
    if (!firebaseAuthInstance) {
      throw new Error('Firebase not initialized');
    }

    if (!config.enableGoogle || !config.googleWebClientId) {
      const configError: AuthError = {
        code: AuthErrorCode.CONFIG_ERROR,
        message: 'Google Sign-In is not enabled or configured. Please add googleWebClientId to your AuthConfig.',
      };
      setError(configError);
      throw configError;
    }

    try {
      setError(null);
      setStatus(AuthStatus.LOADING);

      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.data?.idToken;

      if (!idToken) {
        throw new Error('No ID token received from Google Sign-In');
      }

      const credential = GoogleAuthProvider.credential(idToken);
      await signInWithCredential(firebaseAuthInstance, credential);

      console.log('✅ Google Sign-In successful');

    } catch (err: any) {
      console.error('❌ Google Sign-In Error:', err);
      let mappedError: AuthError;

      if (err.code === 'SIGN_IN_CANCELLED') {
        mappedError = {
          code: AuthErrorCode.GOOGLE_SIGN_IN_CANCELLED,
          message: 'Google Sign-In was cancelled',
          originalError: err
        };
        // Reset status if cancelled, don't leave it loading
        setStatus(AuthStatus.UNAUTHENTICATED);
        return;
      } else if (err.code === 'IN_PROGRESS') {
        mappedError = {
          code: AuthErrorCode.GOOGLE_SIGN_IN_IN_PROGRESS,
          message: 'Google Sign-In is already in progress',
          originalError: err
        };
      } else if (err.code === 'PLAY_SERVICES_NOT_AVAILABLE') {
        mappedError = {
          code: AuthErrorCode.GOOGLE_PLAY_SERVICES_NOT_AVAILABLE,
          message: 'Google Play Services are not available. Please update Google Play Services.',
          originalError: err
        };
      } else {
        mappedError = mapFirebaseError(err);
      }

      setError(mappedError);
      setStatus(AuthStatus.UNAUTHENTICATED);
      throw mappedError;
    }
  };

  // Apple Sign-In using expo-apple-authentication
  const signInWithApple = async () => {
    if (!firebaseAuthInstance) {
      throw new Error('Firebase not initialized');
    }

    if (Platform.OS !== 'ios') {
      const platformError: AuthError = {
        code: AuthErrorCode.APPLE_SIGN_IN_NOT_SUPPORTED,
        message: 'Apple Sign-In is only available on iOS devices',
      };
      setError(platformError);
      throw platformError;
    }

    const isAvailable = await AppleAuthentication.isAvailableAsync();
    if (!isAvailable) {
      const availabilityError: AuthError = {
        code: AuthErrorCode.APPLE_SIGN_IN_NOT_SUPPORTED,
        message: 'Apple Sign-In is not available on this device (requires iOS 13+)',
      };
      setError(availabilityError);
      throw availabilityError;
    }

    try {
      setError(null);
      setStatus(AuthStatus.LOADING);

      const nonce = Math.random().toString(36).substring(2, 10);
      const hashedNonce = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        nonce
      );

      const appleCredential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
        nonce: hashedNonce,
      });

      const { identityToken } = appleCredential;

      if (!identityToken) {
        throw new Error('No identity token received from Apple');
      }

      const provider = new OAuthProvider('apple.com');
      const credential = provider.credential({
        idToken: identityToken,
        rawNonce: nonce,
      });

      await signInWithCredential(firebaseAuthInstance, credential);
      console.log('✅ Apple Sign-In successful');

    } catch (err: any) {
      console.error('❌ Apple Sign-In Error:', err);

      if (err.code === 'ERR_REQUEST_CANCELED') {
        const cancelError: AuthError = {
          code: AuthErrorCode.APPLE_SIGN_IN_CANCELLED,
          message: 'Apple Sign-In was cancelled',
          originalError: err
        };
        setError(cancelError);
        setStatus(AuthStatus.UNAUTHENTICATED);
        return;
      }

      const mappedError = mapFirebaseError(err);
      setError(mappedError);
      setStatus(AuthStatus.UNAUTHENTICATED);
      throw mappedError;
    }
  };

  // Sign Out
  const signOut = async () => {
    try {
      if (firebaseAuthInstance) {
        await firebaseAuthInstance.signOut();
      }
      if (config.enableGoogle) {
        try {
          await GoogleSignin.signOut();
        } catch (googleSignOutError) {
          console.log('Google sign-out skipped or failed:', googleSignOutError);
        }
      }
      console.log('✅ Sign out successful');
    } catch (err) {
      console.error('❌ Sign out error:', err);
      setUser(null);
      setStatus(AuthStatus.UNAUTHENTICATED);
    }
  };

  const clearError = () => setError(null);

  const value = useMemo(() => ({
    user,
    status,
    // ✅ NEW: Combine internal loading with AuthStatus
    isLoading: isDataLoading || status === AuthStatus.LOADING,
    error,
    // ✅ NEW: Expose config for UI to read
    config,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signInWithApple,
    signOut,
    clearError
  }), [user, status, isDataLoading, error, config, firebaseAuthInstance]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};