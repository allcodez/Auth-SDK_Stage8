export interface AuthConfig {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket?: string;
    messagingSenderId?: string;
    appId?: string;
    enableGoogle?: boolean;
    enableApple?: boolean;
    enableEmail?: boolean;
}
export declare const DEFAULT_AUTH_CONFIG: Partial<AuthConfig>;
