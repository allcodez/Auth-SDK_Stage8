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
import { AuthStatus, AuthScreenStyles } from '../types';
import { PasswordInput } from './PasswordInput';

interface LoginFormProps {
  styles?: AuthScreenStyles;
}

export const LoginForm = ({ styles: userStyles }: LoginFormProps) => {
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
    } catch (e) { }
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
    <View style={[defaultStyles.container, userStyles?.container]}>
      {error && (
        <Text style={[defaultStyles.errorText, userStyles?.errorText]}>
          {error.message}
        </Text>
      )}

      {/* Email Input */}
      <TextInput
        style={[defaultStyles.input, userStyles?.input]}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholderTextColor="#999"
        editable={!isLoading}
      />

      {/* Password Input */}
      <PasswordInput
        styles={userStyles}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        editable={!isLoading}
      />

      {/* Sign In Button */}
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
          <Text style={[defaultStyles.buttonText, userStyles?.buttonText]}>
            Sign In
          </Text>
        )}
      </TouchableOpacity>

      {/* OAuth Divider */}
      <View style={defaultStyles.dividerContainer}>
        <View style={defaultStyles.divider} />
        <Text style={defaultStyles.dividerText}>OR</Text>
        <View style={defaultStyles.divider} />
      </View>

      {/* Google Button */}
      <TouchableOpacity
        style={[
          defaultStyles.oauthButton,
          defaultStyles.googleButton,
          isLoading && defaultStyles.oauthButtonDisabled
        ]}
        onPress={handleGoogleSignIn}
        disabled={isLoading}
      >
        <Text style={defaultStyles.googleButtonText}>
          {isLoading ? '...' : '🔍 Continue with Google'}
        </Text>
      </TouchableOpacity>

      {/* Apple Button (iOS Only) */}
      {Platform.OS === 'ios' && (
        <TouchableOpacity
          style={[
            defaultStyles.oauthButton,
            defaultStyles.appleButton,
            isLoading && defaultStyles.oauthButtonDisabled
          ]}
          onPress={handleAppleSignIn}
          disabled={isLoading}
        >
          <Text style={defaultStyles.appleButtonText}>
            {isLoading ? '...' : ' Continue with Apple'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

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

  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: { flex: 1, height: 1, backgroundColor: '#e0e0e0' },
  dividerText: { marginHorizontal: 16, color: '#666', fontSize: 14, fontWeight: '500' },

  oauthButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  oauthButtonDisabled: { opacity: 0.6 },

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

  appleButton: { backgroundColor: '#000' },
  appleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
