// src/types/config.types.ts

export interface AuthConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  // Optional extras for web/other platforms
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
  
  // ✅ NEW: Allow developer to choose persistence strategy
  // 'local' = Keep user logged in forever (Standard Mobile Behavior)
  // 'memory' = Log user out when app closes (Banking App Behavior)
  persistence?: 'local' | 'memory';

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
  persistence: 'local', // Default to standard mobile behavior
};