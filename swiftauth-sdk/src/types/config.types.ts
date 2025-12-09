// src/types/config.types.ts

export interface AuthConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  // Optional extras for web/other platforms
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
  
  // Feature flags for the UI
  enableGoogle?: boolean;
  enableApple?: boolean;
  enableEmail?: boolean;
}

// Default config values
export const DEFAULT_AUTH_CONFIG: Partial<AuthConfig> = {
  enableGoogle: false,
  enableApple: false,
  enableEmail: true,
};