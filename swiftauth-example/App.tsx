import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, ActivityIndicator, Alert } from 'react-native';
// Import from your SDK!
import { AuthProvider, useAuth, AuthStatus } from 'swiftauth-sdk';
import { firebaseConfig } from './firebaseConfig';

// 1. The Inner Component (Must be inside AuthProvider)
const TestAuthScreen = () => {
  const { 
    signInWithEmail, 
    signUpWithEmail, 
    signOut, 
    user, 
    status, 
    error 
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Helper to handle async actions
  const handleAction = async (action: () => Promise<void>) => {
    try {
      await action();
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  };

  if (status === AuthStatus.LOADING) {
    return <ActivityIndicator size="large" style={styles.center} />;
  }

  if (user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Welcome, Ninja! 🥷</Text>
        <Text style={styles.info}>User ID: {user.uid}</Text>
        <Text style={styles.info}>Email: {user.email}</Text>
        <Button title="Sign Out" onPress={() => handleAction(signOut)} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SDK Test Arena</Text>
      
      {error && <Text style={styles.error}>{error.message}</Text>}

      <TextInput 
        placeholder="Email" 
        value={email} 
        onChangeText={setEmail} 
        style={styles.input} 
        autoCapitalize="none"
      />
      <TextInput 
        placeholder="Password" 
        value={password} 
        onChangeText={setPassword} 
        secureTextEntry 
        style={styles.input} 
      />

      <View style={styles.row}>
        <Button 
          title="Sign In" 
          onPress={() => handleAction(() => signInWithEmail(email, password))} 
        />
        <Button 
          title="Sign Up" 
          onPress={() => handleAction(() => signUpWithEmail(email, password))} 
        />
      </View>
    </View>
  );
};

// 2. The Root App (Wraps everything in Provider)
export default function App() {
  return (
    <AuthProvider config={firebaseConfig}>
      <TestAuthScreen />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  info: { fontSize: 16, marginBottom: 10, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 },
  error: { color: 'red', marginBottom: 10, textAlign: 'center' },
  row: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 }
});