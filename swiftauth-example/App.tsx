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

  return <AuthScreen />;
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