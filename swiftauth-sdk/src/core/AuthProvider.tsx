//Note on Logic:
//We use onAuthStateChanged to detect when a user logs in/out.
//We map Firebase users to our custom User type.
//We handle the "Loading" state so the app doesn't flash the login screen while checking if the user is already logged in.


import React, { useEffect, useState, ReactNode, useMemo } from 'react';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  onAuthStateChanged, 
  User as FirebaseUser,
  Auth as FirebaseAuth,
  createUserWithEmailAndPassword, // <--- Added
  signInWithEmailAndPassword,     // <--- Added
} from 'firebase/auth';
import { mapFirebaseError } from '../errors'; // <--- Added
import { AuthContext } from './AuthContext';
import { AuthConfig, AuthStatus, User, AuthError } from '../types';

interface AuthProviderProps {
  config: AuthConfig;
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ config, children }) => {
  // 1. State Management
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>(AuthStatus.LOADING);
  const [error, setError] = useState<AuthError | null>(null);
  const [firebaseAuth, setFirebaseAuth] = useState<FirebaseAuth | null>(null);

  // 2. Initialize Firebase (Only once)
  useEffect(() => {
    let app: FirebaseApp;
    
    // Prevent initializing more than once (Hot Reload safety)
    if (!getApps().length) {
      app = initializeApp({
        apiKey: config.apiKey,
        authDomain: config.authDomain,
        projectId: config.projectId,
        storageBucket: config.storageBucket,
        messagingSenderId: config.messagingSenderId,
        appId: config.appId,
      });
    } else {
      app = getApp();
    }

    const auth = getAuth(app);
    setFirebaseAuth(auth);

    // 3. Listen for Auth Changes
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
      // Handle initialization errors
      console.error("Auth State Error:", err);
      setStatus(AuthStatus.UNAUTHENTICATED);
    });

    return () => unsubscribe();
  }, [config]);

  // 4. Stub Methods (We will implement the real logic in the next step)
  const signInWithEmail = async (email: string, pass: string) => {
    if (!firebaseAuth) return;
    
    try {
      setError(null);
      setStatus(AuthStatus.LOADING);
      await signInWithEmailAndPassword(firebaseAuth, email, pass);
      // Status update is handled automatically by onAuthStateChanged
    } catch (err) {
      const mappedError = mapFirebaseError(err);
      setError(mappedError);
      setStatus(AuthStatus.UNAUTHENTICATED);
      throw mappedError; // Re-throw so the UI can react if needed
    }
  };

  const signUpWithEmail = async (email: string, pass: string) => {
    if (!firebaseAuth) return;

    try {
      setError(null);
      setStatus(AuthStatus.LOADING);
      await createUserWithEmailAndPassword(firebaseAuth, email, pass);
      // Status update is handled automatically by onAuthStateChanged
    } catch (err) {
      const mappedError = mapFirebaseError(err);
      setError(mappedError);
      setStatus(AuthStatus.UNAUTHENTICATED);
      throw mappedError;
    }
  };

  const signInWithGoogle = async () => {
    console.log("Google Sign In - Not implemented yet");
  };
  
  const signInWithApple = async () => {
     console.log("Apple Sign In - Not implemented yet");
  };

  const signOut = async () => {
    if (firebaseAuth) {
      await firebaseAuth.signOut();
    }
  };

  const clearError = () => setError(null);

  // 5. Construct the Context Value
  const value = useMemo(() => ({
    user,
    status,
    error,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signInWithApple,
    signOut,
    clearError
  }), [user, status, error, firebaseAuth]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};