"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapFirebaseError = void 0;
const types_1 = require("../types");
const mapFirebaseError = (error) => {
    // Default fallback
    const fallbackError = {
        code: types_1.AuthErrorCode.UNKNOWN,
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
    const fbError = error;
    switch (fbError.code) {
        // Email/Password Errors
        case 'auth/invalid-email':
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
            return {
                code: types_1.AuthErrorCode.INVALID_CREDENTIALS,
                message: 'Invalid email or password.',
                originalError: error
            };
        case 'auth/email-already-in-use':
            return {
                code: types_1.AuthErrorCode.EMAIL_ALREADY_IN_USE,
                message: 'This email is already registered.',
                originalError: error
            };
        case 'auth/weak-password':
            return {
                code: types_1.AuthErrorCode.WEAK_PASSWORD,
                message: 'Password is too weak. Please use a stronger password.',
                originalError: error
            };
        case 'auth/network-request-failed':
            return {
                code: types_1.AuthErrorCode.NETWORK_ERROR,
                message: 'Network error. Please check your connection.',
                originalError: error
            };
        // Google Sign-In Errors
        case 'auth/popup-closed-by-user':
        case 'auth/cancelled-popup-request':
            return {
                code: types_1.AuthErrorCode.UNKNOWN,
                message: 'Sign-in was cancelled.',
                originalError: error
            };
        case 'auth/account-exists-with-different-credential':
            return {
                code: types_1.AuthErrorCode.EMAIL_ALREADY_IN_USE,
                message: 'An account already exists with this email using a different sign-in method.',
                originalError: error
            };
        case 'auth/invalid-credential':
            return {
                code: types_1.AuthErrorCode.INVALID_CREDENTIALS,
                message: 'The credential received is invalid. Please try again.',
                originalError: error
            };
        case 'auth/operation-not-allowed':
            return {
                code: types_1.AuthErrorCode.UNKNOWN,
                message: 'This sign-in method is not enabled. Please contact support.',
                originalError: error
            };
        case 'auth/user-disabled':
            return {
                code: types_1.AuthErrorCode.INVALID_CREDENTIALS,
                message: 'This account has been disabled.',
                originalError: error
            };
        // Apple Sign-In Errors
        case 'auth/invalid-verification-code':
        case 'auth/invalid-verification-id':
            return {
                code: types_1.AuthErrorCode.INVALID_CREDENTIALS,
                message: 'The verification code is invalid. Please try again.',
                originalError: error
            };
        // Token Expiration
        case 'auth/id-token-expired':
        case 'auth/user-token-expired':
            return {
                code: types_1.AuthErrorCode.TOKEN_EXPIRED,
                message: 'Your session has expired. Please sign in again.',
                originalError: error
            };
        // OAuth-Specific Errors
        case 'auth/unauthorized-domain':
            return {
                code: types_1.AuthErrorCode.UNKNOWN,
                message: 'This domain is not authorized for OAuth operations.',
                originalError: error
            };
        case 'auth/invalid-oauth-provider':
            return {
                code: types_1.AuthErrorCode.UNKNOWN,
                message: 'The OAuth provider configuration is invalid.',
                originalError: error
            };
        case 'auth/invalid-oauth-client-id':
            return {
                code: types_1.AuthErrorCode.UNKNOWN,
                message: 'The OAuth client ID is invalid.',
                originalError: error
            };
        default:
            return {
                code: types_1.AuthErrorCode.UNKNOWN,
                message: fbError.message || 'An unknown error occurred.',
                originalError: error
            };
    }
};
exports.mapFirebaseError = mapFirebaseError;
