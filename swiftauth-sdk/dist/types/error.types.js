"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthError = exports.AuthErrorCode = exports.ProviderErrorCodes = void 0;
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
// ✅ Standardized error codes (used by custom exceptions)
var AuthErrorCode;
(function (AuthErrorCode) {
    // Core authentication errors
    AuthErrorCode["INVALID_CREDENTIALS"] = "auth/invalid-credentials";
    AuthErrorCode["USER_NOT_FOUND"] = "auth/user-not-found";
    AuthErrorCode["EMAIL_ALREADY_IN_USE"] = "auth/email-already-in-use";
    AuthErrorCode["WEAK_PASSWORD"] = "auth/weak-password";
    AuthErrorCode["TOKEN_EXPIRED"] = "auth/token-expired";
    AuthErrorCode["NETWORK_ERROR"] = "auth/network-error";
    AuthErrorCode["UNKNOWN"] = "auth/unknown";
    // Configuration errors
    AuthErrorCode["CONFIG_ERROR"] = "auth/configuration-error";
    // User actions
    AuthErrorCode["CANCELLED"] = "auth/cancelled";
    // Google Sign-In errors
    AuthErrorCode["GOOGLE_SIGN_IN_CANCELLED"] = "auth/google-sign-in-cancelled";
    AuthErrorCode["GOOGLE_SIGN_IN_IN_PROGRESS"] = "auth/google-sign-in-in-progress";
    AuthErrorCode["GOOGLE_PLAY_SERVICES_NOT_AVAILABLE"] = "auth/google-play-services-unavailable";
    AuthErrorCode["GOOGLE_SIGN_IN_FAILED"] = "auth/google-sign-in-failed";
    // Apple Sign-In errors
    AuthErrorCode["APPLE_SIGN_IN_CANCELLED"] = "auth/apple-sign-in-cancelled";
    AuthErrorCode["APPLE_SIGN_IN_FAILED"] = "auth/apple-sign-in-failed";
    AuthErrorCode["APPLE_SIGN_IN_NOT_SUPPORTED"] = "auth/apple-sign-in-not-supported";
})(AuthErrorCode || (exports.AuthErrorCode = AuthErrorCode = {}));
const isAuthError = (error) => {
    return (error &&
        typeof error === 'object' &&
        'code' in error &&
        'message' in error);
};
exports.isAuthError = isAuthError;
