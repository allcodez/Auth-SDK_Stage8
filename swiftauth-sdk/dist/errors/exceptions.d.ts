export declare class AuthException extends Error {
    readonly code: string;
    readonly originalError?: any;
    readonly timestamp: Date;
    constructor(message: string, code: string, originalError?: any);
    toJSON(): {
        name: string;
        code: string;
        message: string;
        timestamp: string;
        originalError: any;
    };
}
export declare class InvalidCredentialsException extends AuthException {
    constructor(originalError?: any);
}
/**
 * Thrown when user account does not exist
 */
export declare class UserNotFoundException extends AuthException {
    constructor(originalError?: any);
}
/**
 * Thrown when attempting to sign up with an email that's already registered
 */
export declare class EmailAlreadyInUseException extends AuthException {
    constructor(originalError?: any);
}
/**
 * Thrown when password doesn't meet minimum security requirements
 */
export declare class WeakPasswordException extends AuthException {
    constructor(originalError?: any);
}
/**
 * Thrown when user's authentication token has expired
 */
export declare class TokenExpiredException extends AuthException {
    constructor(originalError?: any);
}
/**
 * Thrown when network connectivity issues occur
 */
export declare class NetworkException extends AuthException {
    constructor(originalError?: any);
}
/**
 * Thrown when Google Sign-In is cancelled by user
 */
export declare class GoogleSignInCancelledException extends AuthException {
    constructor(originalError?: any);
}
/**
 * Thrown when Apple Sign-In is cancelled by user
 */
export declare class AppleSignInCancelledException extends AuthException {
    constructor(originalError?: any);
}
/**
 * Thrown when Apple Sign-In is not supported on the device
 */
export declare class AppleSignInNotSupportedException extends AuthException {
    constructor(originalError?: any);
}
/**
 * Thrown when Google Play Services are not available
 */
export declare class GooglePlayServicesUnavailableException extends AuthException {
    constructor(originalError?: any);
}
/**
 * Thrown for configuration errors
 */
export declare class ConfigurationException extends AuthException {
    constructor(message: string, originalError?: any);
}
/**
 * Generic unknown error
 */
export declare class UnknownAuthException extends AuthException {
    constructor(message?: string, originalError?: any);
}
