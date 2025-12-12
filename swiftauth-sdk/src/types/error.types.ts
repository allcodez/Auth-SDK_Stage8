export enum ProviderErrorCodes {
  // Firebase specific
  USER_TOKEN_EXPIRED = 'auth/user-token-expired',
  NULL_USER = 'auth/null-user',

  // Google specific
  GOOGLE_CANCELLED = 'SIGN_IN_CANCELLED',
  GOOGLE_IN_PROGRESS = 'IN_PROGRESS',
  GOOGLE_PLAY_UNAVAILABLE = 'PLAY_SERVICES_NOT_AVAILABLE',

  // Apple specific
  APPLE_CANCELLED = 'ERR_REQUEST_CANCELED',
  APPLE_NOT_SUPPORTED = 'APPLE_SIGN_IN_NOT_SUPPORTED'
}

// ✅ Standardized error codes (used by custom exceptions)
export enum AuthErrorCode {
  // Core authentication errors
  INVALID_CREDENTIALS = 'auth/invalid-credentials',
  USER_NOT_FOUND = 'auth/user-not-found',
  EMAIL_ALREADY_IN_USE = 'auth/email-already-in-use',
  WEAK_PASSWORD = 'auth/weak-password',
  TOKEN_EXPIRED = 'auth/token-expired',
  NETWORK_ERROR = 'auth/network-error',
  UNKNOWN = 'auth/unknown',

  // Configuration errors
  CONFIG_ERROR = 'auth/configuration-error',

  // User actions
  CANCELLED = 'auth/cancelled',

  // Google Sign-In errors
  GOOGLE_SIGN_IN_CANCELLED = 'auth/google-sign-in-cancelled',
  GOOGLE_SIGN_IN_IN_PROGRESS = 'auth/google-sign-in-in-progress',
  GOOGLE_PLAY_SERVICES_NOT_AVAILABLE = 'auth/google-play-services-unavailable',
  GOOGLE_SIGN_IN_FAILED = 'auth/google-sign-in-failed',

  // Apple Sign-In errors
  APPLE_SIGN_IN_CANCELLED = 'auth/apple-sign-in-cancelled',
  APPLE_SIGN_IN_FAILED = 'auth/apple-sign-in-failed',
  APPLE_SIGN_IN_NOT_SUPPORTED = 'auth/apple-sign-in-not-supported',
}

export interface AuthError {
  code: string | ProviderErrorCodes | AuthErrorCode;
  message: string;
  originalError?: any;
}

export const isAuthError = (error: any): error is AuthError => {
  return (
    error &&
    typeof error === 'object' &&
    'code' in error &&
    'message' in error
  );
};