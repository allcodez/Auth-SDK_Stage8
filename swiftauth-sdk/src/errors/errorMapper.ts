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
    // Email/Password Errors
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

    // Google Sign-In Errors
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return {
        code: AuthErrorCode.UNKNOWN,
        message: 'Sign-in was cancelled.',
        originalError: error
      };

    case 'auth/account-exists-with-different-credential':
      return {
        code: AuthErrorCode.EMAIL_ALREADY_IN_USE,
        message: 'An account already exists with this email using a different sign-in method.',
        originalError: error
      };

    case 'auth/invalid-credential':
      return {
        code: AuthErrorCode.INVALID_CREDENTIALS,
        message: 'The credential received is invalid. Please try again.',
        originalError: error
      };

    case 'auth/operation-not-allowed':
      return {
        code: AuthErrorCode.UNKNOWN,
        message: 'This sign-in method is not enabled. Please contact support.',
        originalError: error
      };

    case 'auth/user-disabled':
      return {
        code: AuthErrorCode.INVALID_CREDENTIALS,
        message: 'This account has been disabled.',
        originalError: error
      };

    // Apple Sign-In Errors
    case 'auth/invalid-verification-code':
    case 'auth/invalid-verification-id':
      return {
        code: AuthErrorCode.INVALID_CREDENTIALS,
        message: 'The verification code is invalid. Please try again.',
        originalError: error
      };

    // Token Expiration
    case 'auth/id-token-expired':
    case 'auth/user-token-expired':
      return {
        code: AuthErrorCode.TOKEN_EXPIRED,
        message: 'Your session has expired. Please sign in again.',
        originalError: error
      };

    // OAuth-Specific Errors
    case 'auth/unauthorized-domain':
      return {
        code: AuthErrorCode.UNKNOWN,
        message: 'This domain is not authorized for OAuth operations.',
        originalError: error
      };

    case 'auth/invalid-oauth-provider':
      return {
        code: AuthErrorCode.UNKNOWN,
        message: 'The OAuth provider configuration is invalid.',
        originalError: error
      };

    case 'auth/invalid-oauth-client-id':
      return {
        code: AuthErrorCode.UNKNOWN,
        message: 'The OAuth client ID is invalid.',
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