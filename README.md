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

SwiftAuth maps Firebase errors to user-friendly messages:

| Error Code | User Message |
|------------|--------------|
| `auth/invalid-credentials` | "Invalid email or password." |
| `auth/user-not-found` | "Invalid email or password." |
| `auth/email-already-in-use` | "This email is already registered." |
| `auth/weak-password` | "Password is too weak." |
| `auth/network-request-failed` | "Network error. Please check your connection." |

### Basic Usage

```typescript
const { error } = useAuth();

if (error) {
  return <Text style={{ color: 'red' }}>{error.message}</Text>;
}
```

### Advanced: Raw Firebase Errors

For custom UI implementations, access raw Firebase errors:

**Method 1: Try/Catch Block**
```typescript
const { signInWithEmail } = useAuth();

const handleLogin = async () => {
  try {
    await signInWithEmail({ email, password });
  } catch (rawError: any) {
    if (rawError.code === 'auth/requires-recent-login') {
      showReauthModal();
    } else if (rawError.code === 'auth/quota-exceeded') {
      Alert.alert("System Overload", "Please try again later.");
    }
  }
};
```

**Method 2: Global State**
```typescript
const { error } = useAuth();

useEffect(() => {
  if (error?.originalError) {
    const rawCode = (error.originalError as any).code;
    console.log("Raw Firebase Code:", rawCode);
    
    if (rawCode === 'auth/invalid-email') {
      setLocalizedMessage(t('errors.bad_email'));
    }
  }
}, [error]);
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