import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { AuthStatus, AuthScreenStyles } from '../types';
import { PasswordInput } from './PasswordInput';

interface SignUpFormProps {
  styles?: AuthScreenStyles;
  // We need to know if hints are enabled from config
  showHints?: boolean; 
}

export const SignUpForm = ({ styles: userStyles, showHints = true }: SignUpFormProps) => {
  const { signUpWithEmail, status, error } = useAuth();
  
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
    // 1. Validation Checks
    if (password !== confirmPassword) {
      setValidationError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setValidationError("Password is too short.");
      return;
    }
    setValidationError(null);

    // 2. Attempt Sign Up
    try {
      await signUpWithEmail(email, password);
    } catch (e) {
      // Error handled by context
    }
  };

  const isLoading = status === AuthStatus.LOADING;
  // Show actual error or validation error
  const displayError = validationError || (error ? error.message : null);

  return (
    <View style={[defaultStyles.container, userStyles?.container]}>
      {displayError && (
        <Text style={[defaultStyles.errorText, userStyles?.errorText]}>
          {displayError}
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
      
      <PasswordInput 
        styles={userStyles}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
      />

      <PasswordInput 
        styles={userStyles}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      {/* ✅ Password Hints Section (Only shows if config enabled & user is typing) */}
      {showHints && password.length > 0 && (
        <View style={[defaultStyles.hintContainer, userStyles?.hintContainer]}>
          {requirements.map((req, index) => (
            <View key={index} style={defaultStyles.hintRow}>
              <Text style={{ fontSize: 14, marginRight: 6 }}>
                {req.met ? "✅" : "⚪"}
              </Text>
              <Text style={[
                defaultStyles.hintText, 
                userStyles?.hintText,
                req.met && (userStyles?.hintTextMet || defaultStyles.hintTextMet)
              ]}>
                {req.label}
              </Text>
            </View>
          ))}
        </View>
      )}

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
  
  // Hint Styles
  hintContainer: { marginBottom: 15, paddingLeft: 5 },
  hintRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  hintText: { color: '#666', fontSize: 12 },
  hintTextMet: { color: '#34C759', fontWeight: '600' }
});