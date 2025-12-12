"use strict";
// src/types/error.types.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthErrorCode = exports.ProviderErrorCodes = void 0;
// ✅ 1. Define Known Error Codes (Source of Truth)
var ProviderErrorCodes;
(function (ProviderErrorCodes) {
    // Firebase specific
    ProviderErrorCodes["USER_TOKEN_EXPIRED"] = "auth/user-token-expired";
    ProviderErrorCodes["NULL_USER"] = "auth/null-user";
    // Google specific
    ProviderErrorCodes["GOOGLE_CANCELLED"] = "SIGN_IN_CANCELLED";
    ProviderErrorCodes["GOOGLE_IN_PROGRESS"] = "IN_PROGRESS";
    ProviderErrorCodes["GOOGLE_PLAY_UNAVAILABLE"] = "PLAY_SERVICES_NOT_AVAILABLE";
    // Apple specific
    ProviderErrorCodes["APPLE_CANCELLED"] = "ERR_REQUEST_CANCELED";
    ProviderErrorCodes["APPLE_NOT_SUPPORTED"] = "APPLE_SIGN_IN_NOT_SUPPORTED";
})(ProviderErrorCodes || (exports.ProviderErrorCodes = ProviderErrorCodes = {}));
// Legacy error codes used in mapping (Keep this for backward compatibility if needed)
var AuthErrorCode;
(function (AuthErrorCode) {
    AuthErrorCode["INVALID_CREDENTIALS"] = "auth/invalid-credentials";
    AuthErrorCode["USER_NOT_FOUND"] = "auth/user-not-found";
    AuthErrorCode["EMAIL_ALREADY_IN_USE"] = "auth/email-already-in-use";
    AuthErrorCode["WEAK_PASSWORD"] = "auth/weak-password";
    AuthErrorCode["TOKEN_EXPIRED"] = "auth/token-expired";
    AuthErrorCode["NETWORK_ERROR"] = "auth/network-request-failed";
    AuthErrorCode["UNKNOWN"] = "auth/unknown";
    // Specific to SDK flow
    AuthErrorCode["CONFIG_ERROR"] = "auth/configuration-error";
    AuthErrorCode["CANCELLED"] = "auth/cancelled";
    // Google Sign-In Errors
    AuthErrorCode["GOOGLE_SIGN_IN_CANCELLED"] = "GOOGLE_SIGN_IN_CANCELLED";
    AuthErrorCode["GOOGLE_SIGN_IN_IN_PROGRESS"] = "GOOGLE_SIGN_IN_IN_PROGRESS";
    AuthErrorCode["GOOGLE_PLAY_SERVICES_NOT_AVAILABLE"] = "GOOGLE_PLAY_SERVICES_NOT_AVAILABLE";
    AuthErrorCode["GOOGLE_SIGN_IN_FAILED"] = "GOOGLE_SIGN_IN_FAILED";
    // Apple Sign-In Errors
    AuthErrorCode["APPLE_SIGN_IN_CANCELLED"] = "APPLE_SIGN_IN_CANCELLED";
    AuthErrorCode["APPLE_SIGN_IN_FAILED"] = "APPLE_SIGN_IN_FAILED";
    AuthErrorCode["APPLE_SIGN_IN_NOT_SUPPORTED"] = "APPLE_SIGN_IN_NOT_SUPPORTED";
})(AuthErrorCode || (exports.AuthErrorCode = AuthErrorCode = {}));
