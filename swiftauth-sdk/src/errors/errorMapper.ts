import { FirebaseError } from 'firebase/app';
import { AuthError, AuthErrorCode } from '../types';

export const mapFirebaseError = (error: any): AuthError => {
  // Default fallback
  const fallbackError: AuthError = {
    code: AuthErrorCode.UNKNOWN,
    message: 'An unexpected error occurred',
    originalError: error,
  };

  // If it's not a Firebase error, return generic
  if (!error || typeof error.code !== 'string') {
    return {
      ...fallbackError,
      message: error?.message || fallbackError.message
    };
  }

  const fbError = error as FirebaseError;

  switch (fbError.code) {
    case 'auth/invalid-email':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return {
        code: AuthErrorCode.INVALID_CREDENTIALS,
        message: 'Invalid email or password.',
        originalError: error
      };
      
    case 'auth/email-already-in-use':
      return {
        code: AuthErrorCode.EMAIL_ALREADY_IN_USE,
        message: 'This email is already registered.',
        originalError: error
      };

    case 'auth/weak-password':
      return {
        code: AuthErrorCode.WEAK_PASSWORD,
        message: 'Password is too weak. Please use a stronger password.',
        originalError: error
      };

    case 'auth/network-request-failed':
      return {
        code: AuthErrorCode.NETWORK_ERROR,
        message: 'Network error. Please check your connection.',
        originalError: error
      };

    default:
      return {
        code: AuthErrorCode.UNKNOWN,
        message: fbError.message || 'An unknown error occurred.',
        originalError: error
      };
  }
};