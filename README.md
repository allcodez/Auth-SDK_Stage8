# SwiftAuth SDK

A production-ready React Native authentication SDK powered by Firebase. Built with TypeScript, offering both pre-built UI components and headless hooks for complete flexibility.

[![npm version](https://img.shields.io/npm/v/rn-swiftauth-sdk.svg)](https://www.npmjs.com/package/rn-swiftauth-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- 🔐 **Email/Password Authentication** - Built-in validation and error handling
- 🎨 **Pre-built UI Components** - Beautiful, customizable auth screens out of the box
- 🎣 **Headless Hooks** - Full control with `useAuth()` for custom implementations
- 🍎 **Social Login Support** - Google and Apple Sign-In (iOS only for Apple)
- 💾 **Persistent Sessions** - Configurable session management (local/memory)
- 🎯 **TypeScript First** - Full type safety and IntelliSense support
- ⚡ **Zero Configuration** - Works with minimal setup
- 📱 **Expo & Bare React Native** - Compatible with both workflows

---

## 📦 Installation

### Prerequisites

Ensure your environment meets these requirements:
- **Node.js**: v18 or higher
- **React Native**: v0.70+
- **Expo**: SDK 49+ (Recommended)

### Step 1: Install the SDK

Install SwiftAuth SDK from npm:

```bash
npm install rn-swiftauth-sdk
```

**For Expo projects:**
```bash
npx expo install rn-swiftauth-sdk
```

### Step 2: Install Required Dependencies

SwiftAuth requires these peer dependencies:

```bash
npm install firebase @react-native-async-storage/async-storage react-native-safe-area-context
```

**For Expo projects:**
```bash
npx expo install firebase @react-native-async-storage/async-storage react-native-safe-area-context
```

**For Google Sign-In (Optional):**
```bash
npm install @react-native-google-signin/google-signin
# or for Expo
npx expo install @react-native-google-signin/google-signin
```

**For Apple Sign-In (Optional, iOS only):**
```bash
npm install @invertase/react-native-apple-authentication
# or for Expo
npx expo install @invertase/react-native-apple-authentication
```

### Step 3: Install Native Dependencies (Bare React Native only)

If you're using Bare React Native (not Expo), install iOS CocoaPods:

```bash
cd ios
pod install
cd ..
```

That's it! You're ready to start using SwiftAuth SDK.

---

## 🔧 Firebase Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Register a **Web App** (click the `</>` icon)
4. Copy the `firebaseConfig` object

### 2. Enable Authentication Methods

1. Go to **Authentication** > **Sign-in method**
2. Enable **Email/Password**
3. (Optional) Enable **Google** and/or **Apple** for social login

### 3. Platform-Specific Configuration

#### Android Setup

1. In Firebase Console, register an **Android app**
2. Download `google-services.json`
3. Place it in your project: `android/app/google-services.json`

**Update `android/build.gradle`:**
```gradle
buildscript {
  dependencies {
    // Add this line
    classpath 'com.google.gms:google-services:4.3.15'
  }
}
```

**Update `android/app/build.gradle`:**
```gradle
apply plugin: 'com.android.application'
// Add this line at the bottom
apply plugin: 'com.google.gms.google-services'
```

**Update `app.json` for Expo:**
```json
{
  "expo": {
    "android": {
      "googleServicesFile": "./google-services.json",
      "package": "com.yourcompany.yourapp"
    }
  }
}
```

#### iOS Setup

1. In Firebase Console, register an **iOS app**
2. Download `GoogleService-Info.plist`
3. Place it in your project root for Expo, or `ios/YourAppName/GoogleService-Info.plist` for Bare React Native

**For Bare React Native:**
- Drag `GoogleService-Info.plist` into your Xcode project

**Update `app.json` for Expo:**
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

**Install CocoaPods (Bare React Native iOS only):**
```bash
cd ios
pod install
cd ..
```

### 4. Google Sign-In Configuration (Optional)

#### Get Google Client IDs

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. Go to **APIs & Services** > **Credentials**
4. You'll need:
   - **Web Client ID** (for all platforms)
   - **iOS Client ID** (optional, iOS-specific)

**Update `app.json` for Google Sign-In:**
```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.yourcompany.yourapp",
      "googleServicesFile": "./GoogleService-Info.plist"
    },
    "android": {
      "package": "com.yourcompany.yourapp",
      "googleServicesFile": "./google-services.json"
    }
  }
}
```

### 5. Apple Sign-In Configuration (Optional, iOS only)

1. Go to your [Apple Developer Account](https://developer.apple.com/)
2. Enable **Sign in with Apple** capability for your App ID
3. For Bare React Native: Add the capability in Xcode: **Signing & Capabilities** > **+ Capability** > **Sign in with Apple**

**Update `app.json` for Expo:**
```json
{
  "expo": {
    "ios": {
      "usesAppleSignIn": true
    }
  }
}
```

---

## 🚀 Quick Start

### Basic Setup (Email Authentication)

```tsx
// App.tsx
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, AuthScreen, useAuth } from 'rn-swiftauth-sdk';

// Your Firebase configuration
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

  if (!user) {
    return <AuthScreen />;
  }

  return <HomeScreen user={user} />;
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

```tsx
const firebaseConfig = {
  apiKey: "AIzaSyD-Your-Actual-Key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  
  // Enable social login
  enableGoogle: true,
  enableApple: true, // iOS only
  
  // Required for Google Sign-In
  googleWebClientId: "YOUR-CLIENT-ID.apps.googleusercontent.com",
};
```

---

## 📚 API Reference

### `<AuthProvider>`

Wraps your app and provides authentication context.

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `config` | `AuthConfig` | Yes | Firebase configuration object |
| `children` | `ReactNode` | Yes | Your app components |

**AuthConfig Interface:**

```typescript
interface AuthConfig {
  // Firebase credentials (Required)
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
  
  // Session persistence
  persistence?: 'local' | 'memory'; // Default: 'local'
  
  // Feature flags
  enableEmail?: boolean;      // Default: true
  enableGoogle?: boolean;     // Default: false
  enableApple?: boolean;      // Default: false (iOS only)
  
  // Google Sign-In
  googleWebClientId?: string;
  googleIosClientId?: string;
}
```

### `useAuth()` Hook

Access authentication state and methods.

```typescript
const {
  user,           // Current user object or null
  status,         // 'AUTHENTICATED' | 'UNAUTHENTICATED' | 'LOADING'
  error,          // Last error object or null
  signInWithEmail,
  signUpWithEmail,
  signOut,
  clearError
} = useAuth();
```

**Methods:**

| Method | Signature | Description |
|--------|-----------|-------------|
| `signInWithEmail` | `(email: string, password: string) => Promise<void>` | Sign in existing user |
| `signUpWithEmail` | `(email: string, password: string) => Promise<void>` | Create new account |
| `signOut` | `() => Promise<void>` | Log out current user |
| `clearError` | `() => void` | Clear error state |

### `<AuthScreen>` Component

Pre-built authentication UI with login and signup.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `styles` | `AuthScreenStyles` | `undefined` | Custom styles object |
| `titles` | `object` | `undefined` | Custom text labels |
| `showPasswordHints` | `boolean` | `true` | Show password requirements |

**Example:**

```tsx
<AuthScreen 
  titles={{
    loginTitle: "Welcome Back",
    loginSubtitle: "Sign in to continue",
    signupTitle: "Create Account",
    signupSubtitle: "Join us today"
  }}
  styles={{
    container: { backgroundColor: '#f5f5f5' },
    button: { backgroundColor: '#007AFF' },
    buttonText: { color: '#ffffff' }
  }}
  showPasswordHints={true}
/>
```

---

## 🎨 Customization Examples

### Dark Mode Theme

```tsx
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

### Custom UI (Headless)

Build your own interface using the `useAuth()` hook:

```tsx
import { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { useAuth } from 'rn-swiftauth-sdk';

export const CustomLoginScreen = () => {
  const { signInWithEmail, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await signInWithEmail(email, password);
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Login</Text>
      
      {error && <Text style={{ color: 'red' }}>{error.message}</Text>}
      
      <TextInput 
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      
      <TextInput 
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, padding: 10, marginBottom: 20 }}
      />
      
      <Button title="Sign In" onPress={handleLogin} />
    </View>
  );
};
```

---

## ⚠️ Error Handling

SwiftAuth maps Firebase errors to user-friendly codes:

| Error Code | Meaning | User Message |
|------------|---------|--------------|
| `auth/invalid-credentials` | Wrong email/password | "Invalid email or password." |
| `auth/user-not-found` | Account doesn't exist | "Invalid email or password." |
| `auth/email-already-in-use` | Email already registered | "This email is already registered." |
| `auth/weak-password` | Password too weak | "Password is too weak." |
| `auth/network-request-failed` | No internet connection | "Network error. Please check your connection." |
| `auth/invalid-email` | Invalid email format | "Invalid email address." |
| `auth/configuration-error` | Missing API keys | "Authentication is not configured correctly." |

**Usage:**

```tsx
const { error } = useAuth();

if (error) {
  if (error.code === 'auth/network-request-failed') {
    return <OfflineBanner />;
  }
  return <Text style={{ color: 'red' }}>{error.message}</Text>;
}
```

---

## 🔐 Session Management

### Keep User Logged In (Default)

```tsx
const config = {
  ...firebaseConfig,
  persistence: 'local' // User stays logged in
};
```

### Banking App Mode

```tsx
const config = {
  ...firebaseConfig,
  persistence: 'memory' // User logged out when app closes
};
```

---

## 🧪 Example App

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

## 📖 Additional Resources

- [Installation Guide](https://github.com/allcodez/Auth-SDK_Stage8/blob/main/docs/installation.md)
- [Getting Started](https://github.com/allcodez/Auth-SDK_Stage8/blob/main/docs/getting-started.md)
- [API Reference](https://github.com/allcodez/Auth-SDK_Stage8/blob/main/docs/api-reference.md)
- [Usage Examples](https://github.com/allcodez/Auth-SDK_Stage8/blob/main/docs/usage-examples.md)
- [Error Codes](https://github.com/allcodez/Auth-SDK_Stage8/blob/main/docs/error-codes.md)

---

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](https://github.com/allcodez/Auth-SDK_Stage8/blob/main/CONTRIBUTING.md) for guidelines.

---

## 📄 License

MIT License - see [LICENSE](https://github.com/allcodez/Auth-SDK_Stage8/blob/main/LICENSE) file for details.

---

## 🆘 Support

- 📧 Email: support@swiftauth.dev
- 🐛 Issues: [GitHub Issues](https://github.com/allcodez/Auth-SDK_Stage8/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/allcodez/Auth-SDK_Stage8/discussions)
- 📦 NPM Package: [rn-swiftauth-sdk](https://www.npmjs.com/package/rn-swiftauth-sdk)

---

## 🎯 Roadmap

- [ ] Password reset functionality
- [ ] Email verification
- [ ] Phone authentication
- [ ] Multi-factor authentication (MFA)
- [ ] Biometric authentication
- [ ] Session refresh tokens
- [x] NPM package distribution

---

Made with ❤️ by the SwiftAuth Team