"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapFirebaseError = void 0;
const types_1 = require("../types");
const mapFirebaseError = (error) => {
    const fallbackError = {
        code: types_1.AuthErrorCode.UNKNOWN,
        message: 'An unexpected error occurred',
        originalError: error,
    };
    if (!error || typeof error.code !== 'string') {
        return {
            ...fallbackError,
            message: error?.message || fallbackError.message
        };
    }
    const fbError = error;
    switch (fbError.code) {
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
        default:
            return {
                code: types_1.AuthErrorCode.UNKNOWN,
                message: fbError.message || 'An unknown error occurred.',
                originalError: error
            };
    }
};
exports.mapFirebaseError = mapFirebaseError;
