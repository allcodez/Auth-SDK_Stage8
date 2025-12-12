import { AuthException } from './exceptions';
export declare const mapFirebaseError: (error: any) => AuthException;
/**
 * Helper function to check if an error is a specific exception type
 */
export declare const isAuthException: (error: any, exceptionType: new (...args: any[]) => AuthException) => boolean;
/**
 * Helper to extract user-friendly message from any error
 */
export declare const getErrorMessage: (error: any) => string;
