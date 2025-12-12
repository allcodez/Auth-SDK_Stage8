import { AuthConfig } from './config.types';
import { AuthException } from '../errors';
export declare enum AuthStatus {
    AUTHENTICATED = "AUTHENTICATED",
    UNAUTHENTICATED = "UNAUTHENTICATED",
    TOKEN_EXPIRED = "TOKEN_EXPIRED",
    LOADING = "LOADING"
}
export interface User {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    emailVerified: boolean;
    token?: string;
}
export interface EmailSignInOptions {
    email: string;
    password: string;
}
export interface EmailSignUpOptions {
    email: string;
    password: string;
}
export interface AuthContextType {
    user: User | null;
    status: AuthStatus;
    isLoading: boolean;
    error: AuthException | null;
    config: AuthConfig;
    signInWithEmail: (options: EmailSignInOptions) => Promise<void>;
    signUpWithEmail: (options: EmailSignUpOptions) => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    signInWithApple: () => Promise<void>;
    signOut: () => Promise<void>;
    clearError: () => void;
}
