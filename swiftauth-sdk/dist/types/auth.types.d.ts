import { AuthError } from './error.types';
import { AuthConfig } from './config.types';
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
export interface AuthContextType {
    user: User | null;
    status: AuthStatus;
    isLoading: boolean;
    error: AuthError | null;
    config: AuthConfig;
    signInWithEmail: (email: string, pass: string) => Promise<void>;
    signUpWithEmail: (email: string, pass: string) => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    signInWithApple: () => Promise<void>;
    signOut: () => Promise<void>;
    clearError: () => void;
}
