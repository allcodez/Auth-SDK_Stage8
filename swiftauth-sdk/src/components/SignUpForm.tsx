import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';

import { useAuth } from '../hooks/useAuth';
import { AuthScreenStyles } from '../types';
import { PasswordInput } from './PasswordInput';
import { validateEmail, validatePasswordSignup } from '../utils/validation';

interface SignUpFormProps {
  styles?: AuthScreenStyles;
  showHints?: boolean;
}

export const SignUpForm = ({ styles: userStyles, showHints = true }: SignUpFormProps) => {
  const {
    signUpWithEmail,
    signInWithGoogle,
    signInWithApple,
    isLoading,
    error,
    config
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState<{ email?: string; password?: string; confirm?: string }>({});

  // 1. Smart Button Logic: Check if all fields have content
  const isFormFilled = email.length > 0 && password.length > 0 && confirmPassword.length > 0;

  // Password Requirements Logic
  const requirements = [
    { label: "At least 6 characters", met: password.length >= 6 },
    { label: "Contains a number", met: /\d/.test(password) },
    { label: "Passwords match", met: password.length > 0 && password === confirmPassword }
  ];

  const handleSignUp = async () => {
    setValidationErrors({});

    // 2. Validate Inputs
    const emailErr = validateEmail(email);
    const passErr = validatePasswordSignup(password);
    let confirmErr;
    if (password !== confirmPassword) {
      confirmErr = "Passwords do not match.";
    }

    if (emailErr || passErr || confirmErr) {
      setValidationErrors({
        email: emailErr || undefined,
        password: passErr || undefined,
        confirm: confirmErr || undefined
      });
      return;
    }

    try {
      // ✅ UPDATED: New Object Syntax
      await signUpWithEmail({ email, password });
    } catch (e) {
      console.error('Sign Up Failed:', e);
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

  return (
    <View style={[defaultStyles.container, userStyles?.container]}>
      {error && (
        <Text style={[defaultStyles.globalError, userStyles?.errorText]}>
          {error.message}
        </Text>
      )}

      {/* Email Input */}
      <TextInput
        style={[
          defaultStyles.input, 
          userStyles?.input,
          validationErrors.email ? { borderColor: 'red' } : {}
        ]}
        placeholder="Email"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          if (validationErrors.email) setValidationErrors({...validationErrors, email: undefined});
        }}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholderTextColor="#999"
        editable={!isLoading}
      />
      {validationErrors.email && (
        <Text style={defaultStyles.validationText}>{validationErrors.email}</Text>
      )}

      {/* Password Input */}
      <PasswordInput
        styles={userStyles}
        placeholder="Password"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          if (validationErrors.password) setValidationErrors({...validationErrors, password: undefined});
        }}
        editable={!isLoading}
      />
      {validationErrors.password && (
        <Text style={defaultStyles.validationText}>{validationErrors.password}</Text>
      )}

      {/* Confirm Password Input */}
      <PasswordInput
        styles={userStyles}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={(text) => {
          setConfirmPassword(text);
          if (validationErrors.confirm) setValidationErrors({...validationErrors, confirm: undefined});
        }}
        editable={!isLoading}
      />
      {validationErrors.confirm && (
        <Text style={defaultStyles.validationText}>{validationErrors.confirm}</Text>
      )}

      {/* Password Hints Checklist */}
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

      {/* Create Account Button */}
      <TouchableOpacity
        style={[
          defaultStyles.button,
          // Disable style if loading OR form incomplete
          (isLoading || !isFormFilled) && defaultStyles.buttonDisabled,
          userStyles?.button
        ]}
        onPress={handleSignUp}
        // Disable interaction if loading OR form incomplete
        disabled={isLoading || !isFormFilled}
      >
        {isLoading ? (
          <ActivityIndicator color={userStyles?.loadingIndicatorColor || "#fff"} />
        ) : (
          <Text style={[defaultStyles.buttonText, userStyles?.buttonText]}>
            Create Account
          </Text>
        )}
      </TouchableOpacity>

      {/* OAuth Section */}
      {(config.enableGoogle || config.enableApple) && !isLoading && (
        <>
          <View style={defaultStyles.dividerContainer}>
            <View style={defaultStyles.divider} />
            <Text style={defaultStyles.dividerText}>OR</Text>
            <View style={defaultStyles.divider} />
          </View>

          {config.enableGoogle && (
            <TouchableOpacity
              style={[defaultStyles.oauthButton, defaultStyles.googleButton]}
              onPress={handleGoogleSignIn}
            >
              <Text style={defaultStyles.googleButtonText}>
                Sign up with Google
              </Text>
            </TouchableOpacity>
          )}

          {config.enableApple && Platform.OS === 'ios' && (
            <TouchableOpacity
              style={[defaultStyles.oauthButton, defaultStyles.appleButton]}
              onPress={handleAppleSignIn}
            >
              <Text style={defaultStyles.appleButtonText}>
                Sign up with Apple
              </Text>
            </TouchableOpacity>
          )}
        </>
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
    marginBottom: 8,
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
  buttonDisabled: { 
    backgroundColor: '#9ce4ae',
    opacity: 0.7
  },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  globalError: { color: 'red', marginBottom: 12, fontSize: 14, textAlign: 'center' },
  validationText: { color: 'red', fontSize: 12, marginBottom: 10, marginLeft: 4, marginTop: -4 },
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
  hintContainer: { marginBottom: 15, paddingLeft: 5 },
  hintRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  hintText: { color: '#666', fontSize: 12 },
  hintTextMet: { color: '#34C759', fontWeight: '600' }
});