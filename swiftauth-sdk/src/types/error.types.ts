// src/types/error.types.ts

export enum AuthErrorCode {
  INVALID_CREDENTIALS = 'auth/invalid-credentials',
  USER_NOT_FOUND = 'auth/user-not-found',
  EMAIL_ALREADY_IN_USE = 'auth/email-already-in-use',
  WEAK_PASSWORD = 'auth/weak-password',
  TOKEN_EXPIRED = 'auth/token-expired',
  NETWORK_ERROR = 'auth/network-request-failed',
  UNKNOWN = 'auth/unknown',
  // Specific to SDK flow
  CONFIG_ERROR = 'auth/configuration-error',
  CANCELLED = 'auth/cancelled',

  // Google Sign-In Errors
  GOOGLE_SIGN_IN_CANCELLED = 'GOOGLE_SIGN_IN_CANCELLED',
  GOOGLE_SIGN_IN_IN_PROGRESS = 'GOOGLE_SIGN_IN_IN_PROGRESS',
  GOOGLE_PLAY_SERVICES_NOT_AVAILABLE = 'GOOGLE_PLAY_SERVICES_NOT_AVAILABLE',
  GOOGLE_SIGN_IN_FAILED = 'GOOGLE_SIGN_IN_FAILED',

  // Apple Sign-In Errors
  APPLE_SIGN_IN_CANCELLED = 'APPLE_SIGN_IN_CANCELLED',
  APPLE_SIGN_IN_FAILED = 'APPLE_SIGN_IN_FAILED',
  APPLE_SIGN_IN_NOT_SUPPORTED = 'APPLE_SIGN_IN_NOT_SUPPORTED',
}

export interface AuthError {
  code: AuthErrorCode;
  message: string;
  originalError?: any; // To store the raw Firebase error for debugging
}