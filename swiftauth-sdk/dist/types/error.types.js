"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthErrorCode = void 0;
var AuthErrorCode;
(function (AuthErrorCode) {
    AuthErrorCode["INVALID_CREDENTIALS"] = "auth/invalid-credentials";
    AuthErrorCode["USER_NOT_FOUND"] = "auth/user-not-found";
    AuthErrorCode["EMAIL_ALREADY_IN_USE"] = "auth/email-already-in-use";
    AuthErrorCode["WEAK_PASSWORD"] = "auth/weak-password";
    AuthErrorCode["TOKEN_EXPIRED"] = "auth/token-expired";
    AuthErrorCode["NETWORK_ERROR"] = "auth/network-request-failed";
    AuthErrorCode["UNKNOWN"] = "auth/unknown";
    AuthErrorCode["CONFIG_ERROR"] = "auth/configuration-error";
    AuthErrorCode["CANCELLED"] = "auth/cancelled";
})(AuthErrorCode || (exports.AuthErrorCode = AuthErrorCode = {}));
