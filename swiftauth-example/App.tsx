// swiftauth-example/App.tsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
// Import the new component
import { AuthProvider, AuthScreen, useAuth } from 'swiftauth-sdk';
import { firebaseConfig } from './firebaseConfig';
import { SafeAreaProvider } from 'react-native-safe-area-context';
// A wrapper to handle the "Authenticated" state
const AppContent = () => {
  const { user, signOut } = useAuth();

  // If user is logged in, show their profile
  if (user) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>Welcome, {user.email}!</Text>
        <Button title="Sign Out" onPress={() => signOut()} />
      </View>
    );
  }

  // If not logged in, show the Plug-and-Play Auth Screen
  return <AuthScreen />;
};

export default function App() {
  return (
  <SafeAreaProvider>
      <AuthProvider config={firebaseConfig}>
          <AppContent />
        </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 18, marginBottom: 20, fontWeight: 'bold' }
});