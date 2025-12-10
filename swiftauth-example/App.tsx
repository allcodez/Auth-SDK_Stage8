// swiftauth-example/App.tsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { AuthProvider, AuthScreen, useAuth } from 'swiftauth-sdk';
import { firebaseConfig } from './firebaseConfig';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const AppContent = () => {
  const { user, signOut } = useAuth();

  if (user) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>Welcome, {user.email}!</Text>
        <Button title="Sign Out" onPress={() => signOut()} />
      </View>
    );
  }

  // If not logged in, show the Plug-and-Play Auth Screen
  return (
  <AuthScreen
  styles={{
    // 1. Container Styles
    container: {
      backgroundColor: '#f0f9ff'
    },

    // 2. Title Styling (Font Size, Weight, Family)
    title: {
      fontSize: 32,              // ✅ Change Size
      fontWeight: '800',         // ✅ Change Weight
      color: '#0c4a6e',
      fontFamily: 'System',      // ✅ Change Font Family (or custom font)
      fontStyle: 'italic'        // ✅ Change Style
    },

    // 3. Subtitle Styling
    subtitle: {
      fontSize: 14,
      color: '#0369a1',
      letterSpacing: 1.5         // ✅ Advanced typography works too!
    },

    // 4. Input Field Styling
    input: {
      backgroundColor: '#fff',
      borderColor: '#bae6fd',
      borderWidth: 2,
      borderRadius: 12,
      fontSize: 18               // ✅ Make input text larger
    },

    // 5. Button Text Styling
    buttonText: {
      fontSize: 20,
      fontWeight: 'bold',
      textTransform: 'uppercase' // ✅ CSS-like transforms
    }
  }}
/>
);
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider
        config={{
          ...firebaseConfig,
          ui: {
            enableGoogleAuth: false,
            enableAppleAuth: false,
            enableEmailAuth: true,
          }
        }}
      >
        <AppContent />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 18, marginBottom: 20, fontWeight: 'bold' }
});