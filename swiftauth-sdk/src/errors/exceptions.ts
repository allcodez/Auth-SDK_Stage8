export class AuthException extends Error {
    public readonly code: string;
    public readonly originalError?: any;
    public readonly timestamp: Date;

    constructor(message: string, code: string, originalError?: any) {
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

export class InvalidCredentialsException extends AuthException {
    constructor(originalError?: any) {
        super(
            'Invalid email or password. Please check your credentials and try again.',
            'auth/invalid-credentials',
            originalError
        );
    }
}

/**
 * Thrown when user account does not exist
 */
export class UserNotFoundException extends AuthException {
    constructor(originalError?: any) {
        super(
            'No account found with this email. Please sign up first.',
            'auth/user-not-found',
            originalError
        );
    }
}

/**
 * Thrown when attempting to sign up with an email that's already registered
 */
export class EmailAlreadyInUseException extends AuthException {
    constructor(originalError?: any) {
        super(
            'This email is already registered. Please sign in or use a different email.',
            'auth/email-already-in-use',
            originalError
        );
    }
}

/**
 * Thrown when password doesn't meet minimum security requirements
 */
export class WeakPasswordException extends AuthException {
    constructor(originalError?: any) {
        super(
            'Password is too weak. Please use at least 6 characters with a mix of letters and numbers.',
            'auth/weak-password',
            originalError
        );
    }
}

/**
 * Thrown when user's authentication token has expired
 */
export class TokenExpiredException extends AuthException {
    constructor(originalError?: any) {
        super(
            'Your session has expired. Please sign in again.',
            'auth/token-expired',
            originalError
        );
    }
}

/**
 * Thrown when network connectivity issues occur
 */
export class NetworkException extends AuthException {
    constructor(originalError?: any) {
        super(
            'Network error. Please check your internet connection and try again.',
            'auth/network-error',
            originalError
        );
    }
}

/**
 * Thrown when Google Sign-In is cancelled by user
 */
export class GoogleSignInCancelledException extends AuthException {
    constructor(originalError?: any) {
        super(
            'Google Sign-In was cancelled.',
            'auth/google-sign-in-cancelled',
            originalError
        );
    }
}

/**
 * Thrown when Apple Sign-In is cancelled by user
 */
export class AppleSignInCancelledException extends AuthException {
    constructor(originalError?: any) {
        super(
            'Apple Sign-In was cancelled.',
            'auth/apple-sign-in-cancelled',
            originalError
        );
    }
}

/**
 * Thrown when Apple Sign-In is not supported on the device
 */
export class AppleSignInNotSupportedException extends AuthException {
    constructor(originalError?: any) {
        super(
            'Apple Sign-In is only available on iOS 13+ devices.',
            'auth/apple-sign-in-not-supported',
            originalError
        );
    }
}

/**
 * Thrown when Google Play Services are not available
 */
export class GooglePlayServicesUnavailableException extends AuthException {
    constructor(originalError?: any) {
        super(
            'Google Play Services are not available. Please update Google Play Services.',
            'auth/google-play-services-unavailable',
            originalError
        );
    }
}

/**
 * Thrown for configuration errors
 */
export class ConfigurationException extends AuthException {
    constructor(message: string, originalError?: any) {
        super(message, 'auth/configuration-error', originalError);
    }
}

/**
 * Generic unknown error
 */
export class UnknownAuthException extends AuthException {
    constructor(message: string = 'An unexpected error occurred.', originalError?: any) {
        super(message, 'auth/unknown', originalError);
    }
}