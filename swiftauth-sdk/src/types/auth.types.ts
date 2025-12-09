// src/types/auth.types.ts
import { AuthError } from './error.types';

// The specific states requested in the task
export enum AuthStatus {
  AUTHENTICATED = 'AUTHENTICATED',
  UNAUTHENTICATED = 'UNAUTHENTICATED',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  LOADING = 'LOADING', // Helpful for UI spinners
}

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  token?: string;
}

export interface AuthContextType {
  user: User | null;
  status: AuthStatus;
  error: AuthError | null;
  
  // Actions
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signOut: () => Promise<void>;
  
  // Reset error state
  clearError: () => void;
}