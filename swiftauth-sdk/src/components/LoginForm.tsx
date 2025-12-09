import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { AuthStatus, AuthScreenStyles } from '../types';
import { PasswordInput } from './PasswordInput'; // <--- Import logic

interface LoginFormProps {
  styles?: AuthScreenStyles;
}

export const LoginForm = ({ styles: userStyles }: LoginFormProps) => {
  const { signInWithEmail, status, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await signInWithEmail(email, password);
    } catch (e) { }
  };

  const isLoading = status === AuthStatus.LOADING;

  return (
    <View style={[defaultStyles.container, userStyles?.container]}>
      {error && (
        <Text style={[defaultStyles.errorText, userStyles?.errorText]}>
          {error.message}
        </Text>
      )}
      
      <TextInput
        style={[defaultStyles.input, userStyles?.input]}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholderTextColor="#999"
      />
      
      {/* ✅ Replaced standard input with PasswordInput */}
      <PasswordInput 
        styles={userStyles}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity 
        style={[
          defaultStyles.button, 
          isLoading && defaultStyles.buttonDisabled, 
          userStyles?.button
        ]} 
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color={userStyles?.loadingIndicatorColor || "#fff"} />
        ) : (
          <Text style={[defaultStyles.buttonText, userStyles?.buttonText]}>Sign In</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

// ... keep existing StyleSheet (defaultStyles) but remove the old input style if you want cleanup
// For safety, you can leave the StyleSheet as is, it won't break anything.
const defaultStyles = StyleSheet.create({
  container: { width: '100%', marginVertical: 10 },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: { backgroundColor: '#a0cfff' },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  errorText: { color: 'red', marginBottom: 12, fontSize: 14 },
});