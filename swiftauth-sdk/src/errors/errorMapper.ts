// swiftauth-sdk/src/errors/errorMapper.ts

import { FirebaseError } from 'firebase/app';
import {
  AuthException,
  InvalidCredentialsException,
  UserNotFoundException,
  EmailAlreadyInUseException,
  WeakPasswordException,
  TokenExpiredException,
  NetworkException,
  GoogleSignInCancelledException,
  AppleSignInCancelledException,
  AppleSignInNotSupportedException,
  GooglePlayServicesUnavailableException,
  ConfigurationException,
  UnknownAuthException,
} from './exceptions';
import { ProviderErrorCodes } from '../types';

/**
 * Maps Firebase errors to custom exception classes
 * @param error - The original error from Firebase or provider
 * @returns Custom AuthException
 */
export const mapFirebaseError = (error: any): AuthException => {
  // If it's already our custom exception, return it
  if (error instanceof AuthException) {
    return error;
  }

  // If it's not a Firebase error or doesn't have a code, return generic
  if (!error || typeof error.code !== 'string') {
    return new UnknownAuthException(
      error?.message || 'An unexpected error occurred',
      error
    );
  }

  const fbError = error as FirebaseError;

  // Map Firebase error codes to custom exceptions
  switch (fbError.code) {
    // Invalid Credentials
    case 'auth/invalid-email':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
    case 'auth/user-disabled':
      return new InvalidCredentialsException(error);

    // User Not Found
    case 'auth/user-not-found':
      return new UserNotFoundException(error);

    // Email Already In Use
    case 'auth/email-already-in-use':
    case 'auth/account-exists-with-different-credential':
      return new EmailAlreadyInUseException(error);

    // Weak Password
    case 'auth/weak-password':
      return new WeakPasswordException(error);

    // Token Expired
    case 'auth/id-token-expired':
    case 'auth/user-token-expired':
    case ProviderErrorCodes.USER_TOKEN_EXPIRED:
      return new TokenExpiredException(error);

    // Network Error
    case 'auth/network-request-failed':
    case 'auth/timeout':
      return new NetworkException(error);

    // Google Sign-In Errors
    case ProviderErrorCodes.GOOGLE_CANCELLED:
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return new GoogleSignInCancelledException(error);

    case ProviderErrorCodes.GOOGLE_PLAY_UNAVAILABLE:
      return new GooglePlayServicesUnavailableException(error);

    // Apple Sign-In Errors
    case ProviderErrorCodes.APPLE_CANCELLED:
      return new AppleSignInCancelledException(error);

    case ProviderErrorCodes.APPLE_NOT_SUPPORTED:
      return new AppleSignInNotSupportedException(error);

    // Configuration Errors
    case 'auth/operation-not-allowed':
      return new ConfigurationException(
        'This sign-in method is not enabled. Please check your Firebase configuration.',
        error
      );

    case 'auth/unauthorized-domain':
      return new ConfigurationException(
        'This domain is not authorized for OAuth operations.',
        error
      );

    case 'auth/invalid-oauth-provider':
    case 'auth/invalid-oauth-client-id':
      return new ConfigurationException(
        'The OAuth configuration is invalid.',
        error
      );

    // Default
    default:
      return new UnknownAuthException(
        fbError.message || 'An unknown error occurred.',
        error
      );
  }
};

/**
 * Helper function to check if an error is a specific exception type
 */
export const isAuthException = (error: any, exceptionType: new (...args: any[]) => AuthException): boolean => {
  return error instanceof exceptionType;
};

/**
 * Helper to extract user-friendly message from any error
 */
export const getErrorMessage = (error: any): string => {
  if (error instanceof AuthException) {
    return error.message;
  }
  return error?.message || 'An unexpected error occurred';
};