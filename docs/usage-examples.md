# 💡 Usage Examples

## 1. Customizing the UI (Dark Mode)

You can pass a `styles` object to `AuthScreen` to completely change its look. This example creates a dark-themed login screen with gold accents.

```tsx
import { AuthScreen } from 'swiftauth-sdk';

const DarkModeAuth = () => (
  <AuthScreen 
    titles={{
      loginTitle: "Ninja Access",
      loginSubtitle: "Enter the shadow realm",
      signupTitle: "Join the Clan",
      signupSubtitle: "Begin your training"
    }}
    styles={{
      // Main container
      container: { backgroundColor: '#1a1a1a' },
      
      // Text Elements
      title: { color: '#ffffff', fontSize: 30, fontWeight: '800' },
      subtitle: { color: '#cccccc' },
      
      // Form Fields
      input: { 
        backgroundColor: '#333333', 
        color: '#ffffff', 
        borderColor: '#555555',
        borderWidth: 1
      },
      inputContainer: { backgroundColor: '#333333', borderColor: '#555555' },
      eyeIcon: { color: '#ffffff' }, // The eye emoji/icon color
      
      // Buttons
      button: { backgroundColor: '#FFD700', marginTop: 20 },
      buttonText: { color: '#000000', fontWeight: 'bold' },
      
      // Footer Links
      footerText: { color: '#888888' },
      linkText: { color: '#FFD700' }
    }}
  />
);
```

## 2. Headless Mode (Custom UI)

If you want to build your own UI from scratch but use our logic, use the `useAuth` hook. This gives you full control over the layout.

```tsx
import React, { useState } from 'react';
import { View, TextInput, Button, Text, ActivityIndicator } from 'react-native';
import { useAuth, AuthStatus } from 'swiftauth-sdk';

export const CustomLoginPage = () => {
  const { signInWithEmail, status, error } = useAuth();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  if (status === AuthStatus.LOADING) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <View style={{ padding: 20, justifyContent: 'center', flex: 1 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>My Custom App</Text>

      {/* Error Handling */}
      {error && (
        <View style={{ backgroundColor: '#ffebee', padding: 10, marginBottom: 10 }}>
          <Text style={{ color: 'red' }}>{error.message}</Text>
        </View>
      )}
      
      <TextInput 
        placeholder="Email" 
        value={email} 
        onChangeText={setEmail}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      
      <TextInput 
        placeholder="Password" 
        value={pass} 
        onChangeText={setPass} 
        secureTextEntry 
        style={{ borderWidth: 1, padding: 10, marginBottom: 20 }}
      />
      
      <Button 
        title="Login to SwiftAuth" 
        onPress={() => signInWithEmail(email, pass)} 
      />
    </View>
  );
};
```

## 3. Google Sign-In Configuration

To enable Google Sign-In, update your `firebaseConfig` object in `App.tsx`.

```tsx
const firebaseConfig = {
  // ... standard firebase keys ...
  apiKey: "...",
  authDomain: "...",
  
  // Enable Google Feature
  enableGoogle: true,
  
  // Required: Client ID from Google Cloud Console
  // (Create a 'Web' client ID for Expo AuthSession)
  googleWebClientId: "YOUR-CLIENT-ID.apps.googleusercontent.com",
};

// ... pass this to <AuthProvider config={firebaseConfig}>
```

## 4. Configuring Persistence (Session Management)

Control whether the user stays logged in after closing the app.

### Option A: Keep Logged In (Default)

Standard behavior for most apps (Instagram, Twitter).

```tsx
const config = {
  // ... keys ...
  persistence: 'local' 
};
```

### Option B: Banking App Security

Logs the user out immediately when the app is killed or memory is cleared.

```tsx
const config = {
  // ... keys ...
  persistence: 'memory'
};
```