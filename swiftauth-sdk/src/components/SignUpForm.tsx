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

interface SignUpFormProps {
  styles?: AuthScreenStyles;
  showHints?: boolean;
}

export const SignUpForm = ({ styles: userStyles, showHints = true }: SignUpFormProps) => {
  const {
    signUpWithEmail,
    signInWithGoogle,
    signInWithApple,
    status,
    error
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Password Requirements Logic
  const requirements = [
    { label: "At least 6 characters", met: password.length >= 6 },
    { label: "Contains a number", met: /\d/.test(password) },
    { label: "Passwords match", met: password.length > 0 && password === confirmPassword }
  ];

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setValidationError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setValidationError("Password is too short.");
      return;
    }

    setValidationError(null);

    try {
      await signUpWithEmail(email, password);
    } catch (e) {}
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
  const displayError = validationError || (error ? error.message : null);

  return (
    <View style={[defaultStyles.container, userStyles?.container]}>
      {displayError && (
        <Text style={[defaultStyles.errorText, userStyles?.errorText]}>
          {displayError}
        </Text>
      )}

      {/* Email */}
      <TextInput
        style={[defaultStyles.input, userStyles?.input]}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholderTextColor="#999"
      />

      {/* Password */}
      <PasswordInput
        styles={userStyles}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
      />

      {/* Confirm Password */}
      <PasswordInput
        styles={userStyles}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      {/* Password Requirements */}
      {showHints && password.length > 0 && (
        <View style={[defaultStyles.hintContainer, userStyles?.hintContainer]}>
          {requirements.map((req, index) => (
            <View key={index} style={defaultStyles.hintRow}>
              <Text style={{ fontSize: 14, marginRight: 6 }}>
                {req.met ? "✅" : "⚪"}
              </Text>
              <Text
                style={[
                  defaultStyles.hintText,
                  userStyles?.hintText,
                  req.met && (userStyles?.hintTextMet || defaultStyles.hintTextMet)
                ]}
              >
                {req.label}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Create Account */}
      <TouchableOpacity
        style={[
          defaultStyles.button,
          isLoading && defaultStyles.buttonDisabled,
          userStyles?.button
        ]}
        onPress={handleSignUp}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color={userStyles?.loadingIndicatorColor || "#fff"} />
        ) : (
          <Text style={[defaultStyles.buttonText, userStyles?.buttonText]}>
            Create Account
          </Text>
        )}
      </TouchableOpacity>

      {/* Divider */}
      <View style={defaultStyles.dividerContainer}>
        <View style={defaultStyles.divider} />
        <Text style={defaultStyles.dividerText}>OR</Text>
        <View style={defaultStyles.divider} />
      </View>

      {/* Google */}
      <TouchableOpacity
        style={[defaultStyles.oauthButton, defaultStyles.googleButton]}
        onPress={handleGoogleSignIn}
        disabled={isLoading}
      >
        <Text style={defaultStyles.googleButtonText}>
          {isLoading ? '...' : '🔍 Sign up with Google'}
        </Text>
      </TouchableOpacity>

      {/* Apple */}
      {Platform.OS === 'ios' && (
        <TouchableOpacity
          style={[defaultStyles.oauthButton, defaultStyles.appleButton]}
          onPress={handleAppleSignIn}
          disabled={isLoading}
        >
          <Text style={defaultStyles.appleButtonText}>
            {isLoading ? '...' : 'Sign up with Apple'}
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
    backgroundColor: '#34C759',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },

  buttonDisabled: { backgroundColor: '#9ce4ae' },

  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },

  errorText: { color: 'red', marginBottom: 12, fontSize: 14 },

  // OAuth Styles
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: { flex: 1, height: 1, backgroundColor: '#e0e0e0' },
  dividerText: { marginHorizontal: 16, color: '#666', fontSize: 14 },

  oauthButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  googleButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  googleButtonText: { color: '#000', fontSize: 16, fontWeight: '500' },

  appleButton: { backgroundColor: '#000' },
  appleButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },

  // Password Hint Styles
  hintContainer: { marginBottom: 15, paddingLeft: 5 },
  hintRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  hintText: { color: '#666', fontSize: 12 },
  hintTextMet: { color: '#34C759', fontWeight: '600' }
});
