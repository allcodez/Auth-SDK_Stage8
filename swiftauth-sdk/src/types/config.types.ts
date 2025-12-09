export interface AuthConfig {
  // ... existing props
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
  
  persistence?: 'local' | 'memory';

  // Feature flags
  enableGoogle?: boolean;
  enableApple?: boolean;
  enableEmail?: boolean;
  
  // ✅ NEW: Control the Password UI features
  enablePasswordHints?: boolean; // Show the "8 chars, 1 number" checklist
}

export const DEFAULT_AUTH_CONFIG: Partial<AuthConfig> = {
  // ... existing defaults
  enableEmail: true,
  persistence: 'local',
  enablePasswordHints: true, // Default to true (helpful UX)
};