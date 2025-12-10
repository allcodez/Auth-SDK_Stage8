export interface AuthConfig {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket?: string;
    messagingSenderId?: string;
    appId?: string;
    persistence?: 'local' | 'memory';
    enableGoogle?: boolean;
    enableApple?: boolean;
    enableEmail?: boolean;
    googleWebClientId?: string;
    googleIOSClientId?: string;
    ui?: {
        enableGoogleAuth?: boolean;
        enableAppleAuth?: boolean;
        enableEmailAuth?: boolean;
    };
    enablePasswordHints?: boolean;
}
export declare const DEFAULT_AUTH_CONFIG: Partial<AuthConfig>;
