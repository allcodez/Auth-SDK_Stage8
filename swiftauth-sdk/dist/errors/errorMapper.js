"use strict";
// swiftauth-sdk/src/errors/errorMapper.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.getErrorMessage = exports.isAuthException = exports.mapFirebaseError = void 0;
const exceptions_1 = require("./exceptions");
const types_1 = require("../types");
const mapFirebaseError = (error) => {
    // If it's already our custom exception, return it
    if (error instanceof exceptions_1.AuthException) {
        return error;
    }
    // If it's not a Firebase error or doesn't have a code, return generic
    if (!error || typeof error.code !== 'string') {
        return new exceptions_1.UnknownAuthException(error?.message || 'An unexpected error occurred', error);
    }
    const fbError = error;
    // Map Firebase error codes to custom exceptions
    switch (fbError.code) {
        // Invalid Credentials
        case 'auth/invalid-email':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
        case 'auth/user-disabled':
            return new exceptions_1.InvalidCredentialsException(error);
        // User Not Found
        case 'auth/user-not-found':
            return new exceptions_1.UserNotFoundException(error);
        // Email Already In Use
        case 'auth/email-already-in-use':
        case 'auth/account-exists-with-different-credential':
            return new exceptions_1.EmailAlreadyInUseException(error);
        // Weak Password
        case 'auth/weak-password':
            return new exceptions_1.WeakPasswordException(error);
        // Token Expired
        case 'auth/id-token-expired':
        case 'auth/user-token-expired':
        case types_1.ProviderErrorCodes.USER_TOKEN_EXPIRED:
            return new exceptions_1.TokenExpiredException(error);
        // Network Error
        case 'auth/network-request-failed':
        case 'auth/timeout':
            return new exceptions_1.NetworkException(error);
        // Google Sign-In Errors
        case types_1.ProviderErrorCodes.GOOGLE_CANCELLED:
        case 'auth/popup-closed-by-user':
        case 'auth/cancelled-popup-request':
            return new exceptions_1.GoogleSignInCancelledException(error);
        case types_1.ProviderErrorCodes.GOOGLE_PLAY_UNAVAILABLE:
            return new exceptions_1.GooglePlayServicesUnavailableException(error);
        // Apple Sign-In Errors
        case types_1.ProviderErrorCodes.APPLE_CANCELLED:
            return new exceptions_1.AppleSignInCancelledException(error);
        case types_1.ProviderErrorCodes.APPLE_NOT_SUPPORTED:
            return new exceptions_1.AppleSignInNotSupportedException(error);
        // Configuration Errors
        case 'auth/operation-not-allowed':
            return new exceptions_1.ConfigurationException('This sign-in method is not enabled. Please check your Firebase configuration.', error);
        case 'auth/unauthorized-domain':
            return new exceptions_1.ConfigurationException('This domain is not authorized for OAuth operations.', error);
        case 'auth/invalid-oauth-provider':
        case 'auth/invalid-oauth-client-id':
            return new exceptions_1.ConfigurationException('The OAuth configuration is invalid.', error);
        // Default
        default:
            return new exceptions_1.UnknownAuthException(fbError.message || 'An unknown error occurred.', error);
    }
};
exports.mapFirebaseError = mapFirebaseError;
/**
 * Helper function to check if an error is a specific exception type
 */
const isAuthException = (error, exceptionType) => {
    return error instanceof exceptionType;
};
exports.isAuthException = isAuthException;
/**
 * Helper to extract user-friendly message from any error
 */
const getErrorMessage = (error) => {
    if (error instanceof exceptions_1.AuthException) {
        return error.message;
    }
    return error?.message || 'An unexpected error occurred';
};
exports.getErrorMessage = getErrorMessage;
