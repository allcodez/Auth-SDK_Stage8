export interface AuthConfig {
  // Firebase Configuration
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;

  // ✅ NEW: Allow developer to choose persistence strategy
  // 'local' = Keep user logged in forever (Standard Mobile Behavior)
  // 'memory' = Log user out when app closes (Banking App Behavior)
  persistence?: 'local' | 'memory';

  // Feature flags
  enableGoogle?: boolean;
  enableApple?: boolean;
  enableEmail?: boolean;

  // Google Sign-In Configuration
  // Get this from Firebase Console > Authentication > Sign-in method > Google
  googleWebClientId?: string;

  // Optional: iOS Client ID (usually not needed, but available)
  googleIOSClientId?: string;

  ui?: {
    enableGoogleAuth?: boolean;  // Default: true
    enableAppleAuth?: boolean;   // Default: true
    enableEmailAuth?: boolean;   // Default: true
  };

  // ✅ NEW: Control the Password UI features
  enablePasswordHints?: boolean; // Show the "8 chars, 1 number" checklist
}

export const DEFAULT_AUTH_CONFIG: Partial<AuthConfig> = {
  persistence: 'local',
  ui: {
    enableGoogleAuth: true,
    enableAppleAuth: true,
    enableEmailAuth: true,
  },

  enablePasswordHints: true,
};