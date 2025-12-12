# SwiftAuth SDK

A production-ready React Native authentication SDK powered by Firebase. Built with TypeScript, offering both pre-built UI components and headless hooks for complete flexibility.

[![npm version](https://img.shields.io/npm/v/rn-swiftauth-sdk.svg)](https://www.npmjs.com/package/rn-swiftauth-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- **Email/Password Authentication** - Built-in validation and error handling
- **Pre-built UI Components** - Beautiful, customizable auth screens out of the box
- **Headless Hooks** - Full control with `useAuth()` for custom implementations
- **Social Login Support** - Google and Apple Sign-In (iOS only for Apple)
- **Persistent Sessions** - Configurable session management (local/memory)
- **TypeScript First** - Full type safety and IntelliSense support
- **Zero Configuration** - Works with minimal setup
- **Expo & Bare React Native** - Compatible with both workflows

---

## Installation

### Prerequisites

- Node.js v18 or higher
- React Native v0.70+
- Expo SDK 49+ (Recommended)

### Install the SDK

```bash
npm install rn-swiftauth-sdk
```

For Expo projects:
```bash
npx expo install rn-swiftauth-sdk
```

### Install Required Dependencies

```bash
npm install firebase @react-native-async-storage/async-storage react-native-safe-area-context
```

For Expo:
```bash
npx expo install firebase @react-native-async-storage/async-storage react-native-safe-area-context
```

### Optional: Social Login Dependencies

**Google Sign-In:**
```bash
npm install @react-native-google-signin/google-signin
```

**Apple Sign-In (iOS only):**
```bash
npm install @invertase/react-native-apple-authentication
```

### Bare React Native Only

Install iOS CocoaPods:
```bash
cd ios && pod install && cd ..
```

---

## Firebase Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project or select existing one
3. Register a Web App (click the `</>` icon)
4. Copy the `firebaseConfig` object

### 2. Enable Authentication Methods

1. Navigate to **Authentication > Sign-in method**
2. Enable **Email/Password**
3. (Optional) Enable **Google** and/or **Apple** for social login

### 3. Platform-Specific Configuration

**Android:**
- Register an Android app in Firebase Console
- Download `google-services.json` and place in `android/app/`
- Add to `android/build.gradle`:
  ```gradle
  classpath 'com.google.gms:google-services:4.3.15'
  ```
- Add to `android/app/build.gradle`:
  ```gradle
  apply plugin: 'com.google.gms.google-services'
  ```

**iOS:**
- Register an iOS app in Firebase Console
- Download `GoogleService-Info.plist` and place in project root (Expo) or `ios/YourAppName/` (Bare)
- Update `app.json`:
  ```json
  {
    "expo": {
      "ios": {
        "googleServicesFile": "./GoogleService-Info.plist",
        "bundleIdentifier": "com.yourcompany.yourapp"
      }
    }
  }
  ```

For detailed Firebase setup instructions, see the [Firebase documentation](https://firebase.google.com/docs/ios/setup).

---

## Quick Start

### Basic Email Authentication

```typescript
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, AuthScreen, useAuth } from 'rn-swiftauth-sdk';

const firebaseConfig = {
  apiKey: "AIzaSyD-Your-Actual-Key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

const MainNavigation = () => {
  const { user } = useAuth();
  return user ? <HomeScreen user={user} /> : <AuthScreen />;
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

### With Social Login

```typescript
const firebaseConfig = {
  apiKey: "AIzaSyD-Your-Actual-Key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef",
  
  // Enable social login
  enableGoogle: true,
  enableApple: true, // iOS only
  
  // Required for Google Sign-In
  googleWebClientId: "YOUR-CLIENT-ID.apps.googleusercontent.com",
};
```

---

## API Reference

### `<AuthProvider>`

Wraps your app and provides authentication context.

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| config | AuthConfig | Yes | Firebase configuration object |
| children | ReactNode | Yes | Your app components |

### `useAuth()` Hook

Access authentication state and methods.

```typescript
const {
  user,              // Current user object or null
  status,            // AuthStatus enum
  error,             // Last error object or null
  isLoading,         // Boolean loading state
  signInWithEmail,   // Sign in method
  signUpWithEmail,   // Sign up method
  signOut,           // Sign out method
  clearError         // Clear error state
} = useAuth();
```

#### Available Methods

| Method | Signature | Description |
|--------|-----------|-------------|
| `signInWithEmail` | `(options: {email, password}) => Promise<void>` | Sign in existing user |
| `signUpWithEmail` | `(options: {email, password}) => Promise<void>` | Create new account |
| `signOut` | `() => Promise<void>` | Log out current user |
| `clearError` | `() => void` | Clear error state |

---

## Customization

### Dark Mode Theme Example

```typescript
<AuthScreen 
  styles={{
    container: { backgroundColor: '#1a1a1a' },
    title: { color: '#ffffff', fontSize: 30, fontWeight: '800' },
    subtitle: { color: '#cccccc' },
    input: { 
      backgroundColor: '#333333', 
      color: '#ffffff', 
      borderColor: '#555555' 
    },
    button: { backgroundColor: '#FFD700' },
    buttonText: { color: '#000000', fontWeight: 'bold' }
  }}
/>
```

---

## Error Handling

SwiftAuth provides a comprehensive error handling system with custom exceptions that map Firebase errors to user-friendly messages.

### Custom Exception Classes

All errors extend the base `AuthException` class and include:
- `code`: Machine-readable error code
- `message`: User-friendly error message
- `timestamp`: When the error occurred
- `originalError`: The underlying Firebase error (optional)
- `toJSON()`: Serialize for logging/debugging

### Supported Exceptions

| Exception Class | Error Code | User Message |
|-----------------|------------|--------------|
| `InvalidCredentialsException` | `auth/invalid-credentials` | "Invalid email or password. Please check your credentials and try again." |
| `UserNotFoundException` | `auth/user-not-found` | "No account found with this email. Please sign up first." |
| `EmailAlreadyInUseException` | `auth/email-already-in-use` | "This email is already registered. Please sign in or use a different email." |
| `WeakPasswordException` | `auth/weak-password` | "Password is too weak. Please use at least 6 characters with a mix of letters and numbers." |
| `TokenExpiredException` | `auth/token-expired` | "Your session has expired. Please sign in again." |
| `NetworkException` | `auth/network-error` | "Network error. Please check your internet connection and try again." |
| `GoogleSignInCancelledException` | `auth/google-sign-in-cancelled` | "Google Sign-In was cancelled." |
| `AppleSignInCancelledException` | `auth/apple-sign-in-cancelled` | "Apple Sign-In was cancelled." |
| `AppleSignInNotSupportedException` | `auth/apple-sign-in-not-supported` | "Apple Sign-In is only available on iOS 13+ devices." |
| `GooglePlayServicesUnavailableException` | `auth/google-play-services-unavailable` | "Google Play Services are not available. Please update Google Play Services." |
| `ConfigurationException` | `auth/configuration-error` | Custom message based on configuration issue |
| `UnknownAuthException` | `auth/unknown` | "An unexpected error occurred." |

### Basic Error Display
```typescript
import { useAuth } from 'rn-swiftauth-sdk';

const LoginScreen = () => {
  const { error, clearError } = useAuth();

  return (
    <View>
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error.message}</Text>
          <Button title="Dismiss" onPress={clearError} />
        </View>
      )}
    </View>
  );
};
```

### Handling Specific Exception Types
```typescript
import { 
  useAuth,
  InvalidCredentialsException,
  EmailAlreadyInUseException,
  NetworkException 
} from 'rn-swiftauth-sdk';

const SignUpScreen = () => {
  const { signUpWithEmail } = useAuth();

  const handleSignUp = async () => {
    try {
      await signUpWithEmail({ email, password });
    } catch (error) {
      if (error instanceof EmailAlreadyInUseException) {
        Alert.alert(
          "Account Exists",
          "Would you like to sign in instead?",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Sign In", onPress: () => navigation.navigate('SignIn') }
          ]
        );
      } else if (error instanceof NetworkException) {
        Alert.alert("Connection Issue", "Please check your internet and try again.");
      } else if (error instanceof InvalidCredentialsException) {
        Alert.alert("Invalid Input", "Please check your email and password.");
      } else {
        Alert.alert("Error", error.message);
      }
    }
  };

  return <Button title="Sign Up" onPress={handleSignUp} />;
};
```

### Accessing Original Firebase Errors

For advanced use cases, access the raw Firebase error:
```typescript
const { error } = useAuth();

useEffect(() => {
  if (error?.originalError) {
    console.log('Firebase Error Code:', error.originalError.code);
    console.log('Firebase Error Message:', error.originalError.message);
    
    // Custom handling for specific Firebase codes
    if (error.originalError.code === 'auth/requires-recent-login') {
      showReauthenticationPrompt();
    }
  }
}, [error]);
```

### Error Logging for Debugging
```typescript
const { error } = useAuth();

useEffect(() => {
  if (error) {
    // Log full error details (includes timestamp, code, original error)
    console.log('Auth Error:', JSON.stringify(error.toJSON(), null, 2));
    
    // Send to error tracking service (e.g., Sentry)
    logErrorToService(error.toJSON());
  }
}, [error]);
```

### Global Error Boundary
```typescript
import { useAuth } from 'rn-swiftauth-sdk';

const ErrorBoundary = ({ children }) => {
  const { error, clearError } = useAuth();

  if (error) {
    return (
      <View style={styles.errorScreen}>
        <Text style={styles.errorTitle}>Oops!</Text>
        <Text style={styles.errorMessage}>{error.message}</Text>
        <Text style={styles.errorCode}>Error Code: {error.code}</Text>
        <Button title="Try Again" onPress={clearError} />
      </View>
    );
  }

  return <>{children}</>;
};
```

---

## Session Management

### Keep User Logged In (Default)

```typescript
const config = {
  ...firebaseConfig,
  persistence: 'local' // User stays logged in
};
```

### Memory-Only Session

```typescript
const config = {
  ...firebaseConfig,
  persistence: 'memory' // User logged out when app closes
};
```

---

## Backend Integration

The SDK exposes a secure Firebase ID Token (`user.token`) for backend authentication.

### Frontend: Sending the Token

```typescript
import { useAuth } from 'rn-swiftauth-sdk';

const UserProfile = () => {
  const { user } = useAuth();

  const fetchPrivateData = async () => {
    if (!user?.token) return;

    try {
      const response = await fetch('https://your-api.com/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        }
      });
      
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Request failed:', error);
    }
  };

  return <Button title="Get Profile" onPress={fetchPrivateData} />;
};
```

### Backend: Verifying the Token (Node.js)

```javascript
const admin = require('firebase-admin');

// Middleware to verify Firebase ID token
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send('Unauthorized');
  }

  const idToken = authHeader.split('Bearer ')[1];
  
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(403).send('Invalid Token');
  }
};

// Protected route example
app.get('/profile', verifyToken, (req, res) => {
  res.json({ userId: req.user.uid, email: req.user.email });
});
```

---

## Example App

Check out our example implementation:

```bash
# Clone the repository
git clone https://github.com/allcodez/Auth-SDK_Stage8

# Navigate to example app
cd Auth-SDK_Stage8/swiftauth-example

# Install dependencies
npm install

# Start the app
npx expo start
```

---

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## License

MIT License - see [LICENSE](LICENSE) file for details.

---

## Support

- **Issues:** [GitHub Issues](https://github.com/allcodez/Auth-SDK_Stage8/issues)
- **NPM Package:** [rn-swiftauth-sdk](https://www.npmjs.com/package/rn-swiftauth-sdk)
- **Documentation:** [Full Docs](https://github.com/allcodez/Auth-SDK_Stage8)
