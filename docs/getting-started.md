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

That's it! You now have a fully functional authentication flow with persistent login state.