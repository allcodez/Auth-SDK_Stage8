"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnknownAuthException = exports.ConfigurationException = exports.GooglePlayServicesUnavailableException = exports.AppleSignInNotSupportedException = exports.AppleSignInCancelledException = exports.GoogleSignInCancelledException = exports.NetworkException = exports.TokenExpiredException = exports.WeakPasswordException = exports.EmailAlreadyInUseException = exports.UserNotFoundException = exports.InvalidCredentialsException = exports.AuthException = void 0;
class AuthException extends Error {
    code;
    originalError;
    timestamp;
    constructor(message, code, originalError) {
        super(message);
        this.name = this.constructor.name;
        this.code = code;
        this.originalError = originalError;
        this.timestamp = new Date();
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
        Object.setPrototypeOf(this, new.target.prototype);
    }
    toJSON() {
        return {
            name: this.name,
            code: this.code,
            message: this.message,
            timestamp: this.timestamp.toISOString(),
            originalError: this.originalError?.code || this.originalError?.message,
        };
    }
}
exports.AuthException = AuthException;
class InvalidCredentialsException extends AuthException {
    constructor(originalError) {
        super('Invalid email or password. Please check your credentials and try again.', 'auth/invalid-credentials', originalError);
    }
}
exports.InvalidCredentialsException = InvalidCredentialsException;
/**
 * Thrown when user account does not exist
 */
class UserNotFoundException extends AuthException {
    constructor(originalError) {
        super('No account found with this email. Please sign up first.', 'auth/user-not-found', originalError);
    }
}
exports.UserNotFoundException = UserNotFoundException;
/**
 * Thrown when attempting to sign up with an email that's already registered
 */
class EmailAlreadyInUseException extends AuthException {
    constructor(originalError) {
        super('This email is already registered. Please sign in or use a different email.', 'auth/email-already-in-use', originalError);
    }
}
exports.EmailAlreadyInUseException = EmailAlreadyInUseException;
/**
 * Thrown when password doesn't meet minimum security requirements
 */
class WeakPasswordException extends AuthException {
    constructor(originalError) {
        super('Password is too weak. Please use at least 6 characters with a mix of letters and numbers.', 'auth/weak-password', originalError);
    }
}
exports.WeakPasswordException = WeakPasswordException;
/**
 * Thrown when user's authentication token has expired
 */
class TokenExpiredException extends AuthException {
    constructor(originalError) {
        super('Your session has expired. Please sign in again.', 'auth/token-expired', originalError);
    }
}
exports.TokenExpiredException = TokenExpiredException;
/**
 * Thrown when network connectivity issues occur
 */
class NetworkException extends AuthException {
    constructor(originalError) {
        super('Network error. Please check your internet connection and try again.', 'auth/network-error', originalError);
    }
}
exports.NetworkException = NetworkException;
/**
 * Thrown when Google Sign-In is cancelled by user
 */
class GoogleSignInCancelledException extends AuthException {
    constructor(originalError) {
        super('Google Sign-In was cancelled.', 'auth/google-sign-in-cancelled', originalError);
    }
}
exports.GoogleSignInCancelledException = GoogleSignInCancelledException;
/**
 * Thrown when Apple Sign-In is cancelled by user
 */
class AppleSignInCancelledException extends AuthException {
    constructor(originalError) {
        super('Apple Sign-In was cancelled.', 'auth/apple-sign-in-cancelled', originalError);
    }
}
exports.AppleSignInCancelledException = AppleSignInCancelledException;
/**
 * Thrown when Apple Sign-In is not supported on the device
 */
class AppleSignInNotSupportedException extends AuthException {
    constructor(originalError) {
        super('Apple Sign-In is only available on iOS 13+ devices.', 'auth/apple-sign-in-not-supported', originalError);
    }
}
exports.AppleSignInNotSupportedException = AppleSignInNotSupportedException;
/**
 * Thrown when Google Play Services are not available
 */
class GooglePlayServicesUnavailableException extends AuthException {
    constructor(originalError) {
        super('Google Play Services are not available. Please update Google Play Services.', 'auth/google-play-services-unavailable', originalError);
    }
}
exports.GooglePlayServicesUnavailableException = GooglePlayServicesUnavailableException;
/**
 * Thrown for configuration errors
 */
class ConfigurationException extends AuthException {
    constructor(message, originalError) {
        super(message, 'auth/configuration-error', originalError);
    }
}
exports.ConfigurationException = ConfigurationException;
/**
 * Generic unknown error
 */
class UnknownAuthException extends AuthException {
    constructor(message = 'An unexpected error occurred.', originalError) {
        super(message, 'auth/unknown', originalError);
    }
}
exports.UnknownAuthException = UnknownAuthException;
