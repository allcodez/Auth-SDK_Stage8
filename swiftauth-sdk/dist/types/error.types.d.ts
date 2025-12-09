export declare enum AuthErrorCode {
    INVALID_CREDENTIALS = "auth/invalid-credentials",
    USER_NOT_FOUND = "auth/user-not-found",
    EMAIL_ALREADY_IN_USE = "auth/email-already-in-use",
    WEAK_PASSWORD = "auth/weak-password",
    TOKEN_EXPIRED = "auth/token-expired",
    NETWORK_ERROR = "auth/network-request-failed",
    UNKNOWN = "auth/unknown",
    CONFIG_ERROR = "auth/configuration-error",
    CANCELLED = "auth/cancelled"
}
export interface AuthError {
    code: AuthErrorCode;
    message: string;
    originalError?: any;
}
