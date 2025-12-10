export interface AuthConfig {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket?: string;
    messagingSenderId?: string;
    appId?: string;
    persistence?: 'local' | 'memory';
    persistence?: 'local' | 'memory';
    enableGoogle?: boolean;
    enableApple?: boolean;
    enableEmail?: boolean;
    googleWebClientId?: string;
    googleIOSClientId?: string;
}
export declare const DEFAULT_AUTH_CONFIG: Partial<AuthConfig>;
