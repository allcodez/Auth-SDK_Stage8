# 🚀 Getting Started

Follow these steps to integrate authentication into your app in minutes.

## 1. Get Firebase Credentials

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Create a project (or select an existing one).
3. Register a **Web App** (Click the `</>` icon).
4. Copy the `firebaseConfig` object provided.
5. **Important:** Go to **Authentication** > **Sign-in method** and enable **Email/Password**.

## 2. Configure the Provider

Wrap your root application component with `SafeAreaProvider` (for UI layout) and `AuthProvider` (for logic).

```tsx
// App.tsx
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from 'swiftauth-sdk';

// Your Firebase keys
export const firebaseConfig = {
  apiKey: "AIzaSyD-Your-Actual-Key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  // Optional: persistence: 'local' | 'memory' (Default: 'local')
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider config={firebaseConfig}>
        <MainNavigation />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
```

## 3. Use the Pre-built UI (Plug-and-Play)

The easiest way to add auth is using the `AuthScreen` component. It handles Login, Sign Up, Password Validation, and Error states automatically.

```tsx
import { AuthScreen, useAuth } from 'swiftauth-sdk';

const MainNavigation = () => {
  const { user } = useAuth();

  // If user is not logged in, show Auth Screen
  if (!user) {
    return <AuthScreen />;
  }

  // If logged in, show your App content
  return <HomeScreen user={user} />;
};
```
# 🔐 Configuring Social Logins

SwiftAuth SDK allows you to toggle social login methods (Google, Apple) on or off using the config object passed to the `AuthProvider`. The UI is reactive: If you enable a method, the button appears automatically. If you disable all social methods, the "OR" divider and social section are completely hidden.

## 1. Enabling Google Sign-In

To show the "Sign in with Google" button, set `enableGoogle: true` and provide your Web Client ID.

```tsx
// App.tsx
const authConfig = {
  // ... standard firebase keys ...
  
  // ✅ Enable the Google Button
  enableGoogle: true,
  
  // ⚠️ Required: The button will show an error if this is missing
  googleWebClientId: "YOUR_WEB_CLIENT_ID.apps.googleusercontent.com",
};
```

## 2. Enabling Apple Sign-In

To show the "Sign in with Apple" button, set `enableApple: true`.

**Note:** The Apple button will only appear on iOS devices (`Platform.OS === 'ios'`). It is automatically hidden on Android to prevent crashes.

```tsx
const authConfig = {
  // ... keys ...
  
  // ✅ Enable the Apple Button (iOS only)
  enableApple: true,
};
```

## 3. Email-Only Mode (Hiding Everything)

If you want a clean, email-only form, simply set both flags to `false`. The SDK will automatically remove the social buttons and the "OR" divider line.

```tsx
const authConfig = {
  // ... keys ...
  
  enableEmail: true,
  
  // ❌ Hide Social Buttons
  enableGoogle: false,
  enableApple: false,
};
```

## Configuration Property Reference

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `enableGoogle` | `boolean` | `false` | Shows the Google Sign-In button. Requires `googleWebClientId`. |
| `enableApple` | `boolean` | `false` | Shows the Apple Sign-In button. Visible on iOS only. |
| `googleWebClientId` | `string` | `undefined` | The OAuth 2.0 Client ID from Google Cloud Console. |
| `googleIosClientId` | `string` | `undefined` | (Optional) Specific Client ID for iOS if not using the Web Client ID fallback. |

That's it! You now have a fully functional authentication flow with persistent login state.