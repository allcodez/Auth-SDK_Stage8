import React, { useEffect, useState, ReactNode, useMemo } from 'react';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';

// 1. Standard Imports (Note: getReactNativePersistence REMOVED from here)
import { 
  getAuth, 
  initializeAuth, 
  onAuthStateChanged, 
  User as FirebaseUser,
  Auth as FirebaseAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';

// 2. THE FIX: Manually extract the hidden function
import * as firebaseAuth from 'firebase/auth';
// @ts-ignore: Force TypeScript to ignore the missing type definition
const getReactNativePersistence = (firebaseAuth as any).getReactNativePersistence;

import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage'; 

import { mapFirebaseError } from '../errors';
import { AuthContext } from './AuthContext';
import { AuthConfig, AuthStatus, User, AuthError } from '../types';

interface AuthProviderProps {
  config: AuthConfig;
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ config, children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>(AuthStatus.LOADING);
  const [error, setError] = useState<AuthError | null>(null);
  const [firebaseAuthInstance, setFirebaseAuthInstance] = useState<FirebaseAuth | null>(null);

  useEffect(() => {
    let app: FirebaseApp;
    let auth: FirebaseAuth;

    if (!getApps().length) {
      // 1. Initialize the App
      app = initializeApp({
        apiKey: config.apiKey,
        authDomain: config.authDomain,
        projectId: config.projectId,
        storageBucket: config.storageBucket,
        messagingSenderId: config.messagingSenderId,
        appId: config.appId,
      });

      // 2. Initialize Auth with Persistence
      auth = initializeAuth(app, {
        persistence: getReactNativePersistence(ReactNativeAsyncStorage)
      });

    } else {
      // If already initialized (Hot Reload), reuse the existing instance
      app = getApp();
      auth = getAuth(app);
    }

    setFirebaseAuthInstance(auth);

    const unsubscribe = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        // User is signed in
        const token = await fbUser.getIdToken();
        setUser({
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName,
          photoURL: fbUser.photoURL,
          emailVerified: fbUser.emailVerified,
          token: token
        });
        setStatus(AuthStatus.AUTHENTICATED);
      } else {
        // User is signed out
        setUser(null);
        setStatus(AuthStatus.UNAUTHENTICATED);
      }
    }, (err) => {
      console.error("Auth State Error:", err);
      setStatus(AuthStatus.UNAUTHENTICATED);
    });

    return () => unsubscribe();
  }, [config]);

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

  const signOut = async () => {
    if (firebaseAuthInstance) {
      await firebaseAuthInstance.signOut();
    }
  };

  const clearError = () => setError(null);

  const value = useMemo(() => ({
    user,
    status,
    error,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle: async () => {},
    signInWithApple: async () => {},
    signOut,
    clearError
  }), [user, status, error, firebaseAuthInstance]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};