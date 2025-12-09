# 📚 API Reference

## `AuthProvider`

The context provider that initializes Firebase and manages global authentication state.

**Props:**

| Prop | Type | Description |
| :--- | :--- | :--- |
| `config` | `AuthConfig` | Your Firebase configuration object. |
| `children` | `ReactNode` | Your app components. |

### `AuthConfig` Interface

```typescript
interface AuthConfig {
  // Firebase Keys (Required)
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
  
  /**
   * Controls how long the user stays logged in.
   * - 'local' (Default): Keep user logged in indefinitely (Standard mobile behavior).
   * - 'memory': Log user out when the app is closed or killed (Banking app behavior).
   */
  persistence?: 'local' | 'memory';

  /**
   * Feature Flags 
   */
  enableGoogle?: boolean; // (Coming Soon)
  enableApple?: boolean;  // (Coming Soon)
  enableEmail?: boolean;  // Default: true
}
```

## `useAuth()` Hook

A hook that returns the current authentication context and methods.

```typescript
const { 
  user, 
  status, 
  error,
  signInWithEmail, 
  signUpWithEmail, 
  signOut,
  clearError
} = useAuth();
```

### Return Values

| Property | Type | Description |
| :--- | :--- | :--- |
| `user` | `User \| null` | The current authenticated user object containing `uid`, `email`, etc. |
| `status` | `AuthStatus` | Enum: `AUTHENTICATED`, `UNAUTHENTICATED`, or `LOADING`. |
| `error` | `AuthError \| null` | The last error that occurred during an operation. |
| `signInWithEmail` | `(email, password) => Promise<void>` | Signs in an existing user. Throws error on failure. |
| `signUpWithEmail` | `(email, password) => Promise<void>` | Creates a new account. Throws error on failure. |
| `signOut` | `() => Promise<void>` | Logs out the current user and clears persistence. |
| `clearError` | `() => void` | Manually resets the error state to null. |

## `AuthScreen` Component

A complete, pre-styled authentication widget that handles Login, Sign Up, and Validation logic automatically.

### Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `styles` | `AuthScreenStyles` | `undefined` | Override default styles for any part of the UI. |
| `titles` | `object` | `undefined` | Customize the Header/Subtitle text for Login and Signup views. |
| `showPasswordHints` | `boolean` | `true` | Enable/disable the checklist (length, number, match) during sign up. |

### Customizing Text (`titles` prop)

```typescript
<AuthScreen 
  titles={{
    loginTitle: "Welcome Back",
    loginSubtitle: "Please sign in",
    signupTitle: "Join Us",
    signupSubtitle: "Create your account"
  }}
/>
```

### Styling (`AuthScreenStyles`)

You can override specific styles using standard React Native style objects.

```typescript
interface AuthScreenStyles {
  // Containers
  container?: ViewStyle;      // Main background
  header?: ViewStyle;         // Header area
  footer?: ViewStyle;         // Bottom area (toggle link)
  
  // Text
  title?: TextStyle;          // "Welcome Back"
  subtitle?: TextStyle;       // "Sign in to continue"
  errorText?: TextStyle;      // Validation errors
  
  // Forms
  input?: TextStyle;          // Text input fields
  inputContainer?: ViewStyle; // Wrapper for input + eye icon
  
  // Buttons
  button?: ViewStyle;         // Main action button
  buttonText?: TextStyle;     // Button label
  loadingIndicatorColor?: string; // Color of the spinner
  
  // Password Hints
  hintContainer?: ViewStyle;
  hintText?: TextStyle;
  hintTextMet?: TextStyle;    // Style when a requirement is met (e.g., green color)
}
```