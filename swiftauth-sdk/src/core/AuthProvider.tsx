import React, { useEffect, useState, ReactNode, useMemo } from 'react';
import { Platform } from 'react-native';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import * as FirebaseAuth from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';
import {
  AuthException,
  mapFirebaseError,
  ConfigurationException,
  AppleSignInNotSupportedException,
  AppleSignInCancelledException,
  GoogleSignInCancelledException,
} from '../errors';
import { AuthContext } from './AuthContext';
import {
  AuthConfig,
  AuthStatus,
  User,
  ProviderErrorCodes,
  EmailSignInOptions,
  EmailSignUpOptions
} from '../types';

const getReactNativePersistence = (FirebaseAuth as any).getReactNativePersistence;

interface AuthProviderProps {
  config: AuthConfig;
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ config, children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>(AuthStatus.LOADING);
  const [error, setError] = useState<AuthException | null>(null);
  const [firebaseAuthInstance, setFirebaseAuthInstance] = useState<FirebaseAuth.Auth | null>(null);
  const [isDataLoading, setIsDataLoading] = useState(true);

  // --- INITIALIZATION ---
  useEffect(() => {
    let app: FirebaseApp;
    let auth: FirebaseAuth.Auth;

    if (!getApps().length) {
      app = initializeApp({
        apiKey: config.apiKey,
        authDomain: config.authDomain,
        projectId: config.projectId,
        storageBucket: config.storageBucket,
        messagingSenderId: config.messagingSenderId,
        appId: config.appId,
      });

      const selectedPersistence = config.persistence === 'memory'
        ? FirebaseAuth.inMemoryPersistence
        : getReactNativePersistence(ReactNativeAsyncStorage);

      auth = FirebaseAuth.initializeAuth(app, {
        persistence: selectedPersistence
      });
    } else {
      app = getApp();
      auth = FirebaseAuth.getAuth(app);
    }

    setFirebaseAuthInstance(auth);

    if (config.enableGoogle && config.googleWebClientId) {
      try {
        GoogleSignin.configure({
          webClientId: config.googleWebClientId,
          offlineAccess: true,
          iosClientId: config.googleIOSClientId,
        });
        console.log('Google Sign-In configured successfully');
      } catch (err) {
        console.error('Google Sign-In configuration failed:', err);
      }
    }

    const unsubscribe = FirebaseAuth.onAuthStateChanged(auth, async (fbUser) => {
      try {
        if (fbUser) {
          try {
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
            if (tokenError.code === ProviderErrorCodes.USER_TOKEN_EXPIRED ||
                tokenError.code === ProviderErrorCodes.NULL_USER) {
              setStatus(AuthStatus.TOKEN_EXPIRED);
              setError(mapFirebaseError(tokenError));
            } else {
              setStatus(AuthStatus.UNAUTHENTICATED);
              setError(mapFirebaseError(tokenError));
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
        setError(mapFirebaseError(err));
      } finally {
        setIsDataLoading(false);
      }
    });

    return () => unsubscribe();
  }, [config]);

  // --- ACTIONS ---

  const signInWithEmail = async ({ email, password }: EmailSignInOptions) => {
    if (!firebaseAuthInstance) return;
    try {
      setError(null);
      setStatus(AuthStatus.LOADING);
      await FirebaseAuth.signInWithEmailAndPassword(firebaseAuthInstance, email, password);
    } catch (err: any) {
      const mappedException = mapFirebaseError(err);
      setError(mappedException);
      setStatus(AuthStatus.UNAUTHENTICATED);
      throw mappedException;
    }
  };

  const signUpWithEmail = async ({ email, password }: EmailSignUpOptions) => {
    if (!firebaseAuthInstance) return;
    try {
      setError(null);
      setStatus(AuthStatus.LOADING);
      await FirebaseAuth.createUserWithEmailAndPassword(firebaseAuthInstance, email, password);
    } catch (err: any) {
      const mappedException = mapFirebaseError(err);
      setError(mappedException);
      setStatus(AuthStatus.UNAUTHENTICATED);
      throw mappedException;
    }
  };

  const signInWithGoogle = async () => {
    if (!firebaseAuthInstance) throw new Error('Firebase not initialized');
    if (!config.enableGoogle || !config.googleWebClientId) {
      const configError = new ConfigurationException(
        'Google Auth not configured. Missing googleWebClientId.'
      );
      setError(configError);
      throw configError;
    }

    try {
      setError(null);
      setStatus(AuthStatus.LOADING);

      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.data?.idToken;

      if (!idToken) throw new Error('No ID token received from Google Sign-In');

      const credential = FirebaseAuth.GoogleAuthProvider.credential(idToken);
      await FirebaseAuth.signInWithCredential(firebaseAuthInstance, credential);
      console.log('Google Sign-In successful');

    } catch (err: any) {
      console.error('Google Sign-In Error:', err);

      if (err.code === ProviderErrorCodes.GOOGLE_CANCELLED) {
        const cancelError = new GoogleSignInCancelledException(err);
        setError(cancelError);
        setStatus(AuthStatus.UNAUTHENTICATED);
        return;
      }

      const mappedException = mapFirebaseError(err);
      setError(mappedException);
      setStatus(AuthStatus.UNAUTHENTICATED);
      throw mappedException;
    }
  };

  const signInWithApple = async () => {
    if (!firebaseAuthInstance) throw new Error('Firebase not initialized');

    if (Platform.OS !== 'ios') {
      const platformError = new AppleSignInNotSupportedException();
      setError(platformError);
      throw platformError;
    }

    const isAvailable = await AppleAuthentication.isAvailableAsync();
    if (!isAvailable) {
      const availabilityError = new AppleSignInNotSupportedException();
      setError(availabilityError);
      throw availabilityError;
    }

    try {
      setError(null);
      setStatus(AuthStatus.LOADING);

      const nonce = Math.random().toString(36).substring(2, 10);
      const hashedNonce = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, nonce);

      const appleCredential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
        nonce: hashedNonce,
      });

      const { identityToken } = appleCredential;

      if (!identityToken) throw new Error('No identity token received from Apple');

      const provider = new FirebaseAuth.OAuthProvider('apple.com');
      const credential = provider.credential({
        idToken: identityToken,
        rawNonce: nonce,
      });

      await FirebaseAuth.signInWithCredential(firebaseAuthInstance, credential);
      console.log('Apple Sign-In successful');

    } catch (err: any) {
      console.error('Apple Sign-In Error:', err);

      if (err.code === ProviderErrorCodes.APPLE_CANCELLED) {
        const cancelError = new AppleSignInCancelledException(err);
        setError(cancelError);
        setStatus(AuthStatus.UNAUTHENTICATED);
        return;
      }

      const mappedException = mapFirebaseError(err);
      setError(mappedException);
      setStatus(AuthStatus.UNAUTHENTICATED);
      throw mappedException;
    }
  };

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
      console.log('Sign out successful');
    } catch (err) {
      console.error('Sign out error:', err);
      const signOutError = mapFirebaseError(err);
      setError(signOutError);
      setUser(null);
      setStatus(AuthStatus.UNAUTHENTICATED);
    }
  };

  const clearError = () => setError(null);

  const value = useMemo(() => ({
    user,
    status,
    isLoading: isDataLoading || status === AuthStatus.LOADING,
    error,
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