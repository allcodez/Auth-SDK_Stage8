import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform
} from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { AuthStatus } from '../types';

export const LoginForm = () => {
  const {
    signInWithEmail,
    signInWithGoogle,
    signInWithApple,
    status,
    error
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await signInWithEmail(email, password);
    } catch (e) {
      // Error is handled by context, but we catch here to prevent unhandled promise warnings
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (e) {
      console.error('Google Sign-In Error:', e);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      await signInWithApple();
    } catch (e) {
      console.error('Apple Sign-In Error:', e);
    }
  };

  const isLoading = status === AuthStatus.LOADING;

  return (
    <View style={styles.container}>
      {error && <Text style={styles.errorText}>{error.message}</Text>}

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        editable={!isLoading}
      />

      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!isLoading}
      />

      {/* Email Sign In Button */}
      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign In</Text>
        )}
      </TouchableOpacity>

      {/* OAuth Divider */}
      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        <Text style={styles.dividerText}>OR</Text>
        <View style={styles.divider} />
      </View>

      {/* Google Sign-In Button */}
      <TouchableOpacity
        style={[styles.oauthButton, styles.googleButton, isLoading && styles.oauthButtonDisabled]}
        onPress={handleGoogleSignIn}
        disabled={isLoading}
      >
        <Text style={styles.googleButtonText}>
          {isLoading ? '...' : '🔍 Continue with Google'}
        </Text>
      </TouchableOpacity>

      {/* Apple Sign-In Button (iOS Only) */}
      {Platform.OS === 'ios' && (
        <TouchableOpacity
          style={[styles.oauthButton, styles.appleButton, isLoading && styles.oauthButtonDisabled]}
          onPress={handleAppleSignIn}
          disabled={isLoading}
        >
          <Text style={styles.appleButtonText}>
            {isLoading ? '...' : ' Continue with Apple'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%', marginVertical: 10 },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
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

  // OAuth Styles
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  oauthButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  oauthButtonDisabled: {
    opacity: 0.6,
  },
  googleButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  googleButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
  },
  appleButton: {
    backgroundColor: '#000',
  },
  appleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});