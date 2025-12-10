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
import { AuthScreenStyles } from '../types';
import { PasswordInput } from './PasswordInput';
import { validateEmail, validatePasswordLogin } from '../utils/validation';

interface LoginFormProps {
  styles?: AuthScreenStyles;
}

export const LoginForm = ({ styles: userStyles }: LoginFormProps) => {
  const {
    signInWithEmail,
    signInWithGoogle,
    signInWithApple,
    isLoading, // ✅ Using the simplified boolean we added to context
    error,
    config // ✅ We need this to check if social buttons are enabled
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // ✅ Validation Error State
  const [validationErrors, setValidationErrors] = useState<{ email?: string; password?: string }>({});

  const handleLogin = async () => {
    // 1. Reset previous errors
    setValidationErrors({});

    // 2. Validate Inputs
    const emailErr = validateEmail(email);
    const passErr = validatePasswordLogin(password);

    if (emailErr || passErr) {
      setValidationErrors({
        email: emailErr || undefined,
        password: passErr || undefined
      });
      return; // 🛑 Stop if invalid
    }

    // 3. Attempt Login
    try {
      await signInWithEmail(email, password);
    } catch (e) { 
      // Auth errors handled by global state
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
      {/* Global API Error */}
      {error && (
        <Text style={[defaultStyles.errorText, userStyles?.errorText]}>
          {error.message}
        </Text>
      )}

      {/* Email Input */}
      <TextInput
        style={[
          defaultStyles.input, 
          userStyles?.input,
          validationErrors.email ? { borderColor: 'red' } : {} // Highlight on error
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
      {/* Validation Message */}
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

      {/* OAuth Section - Conditionally Rendered based on Config */}
      {(config.enableGoogle || config.enableApple) && !isLoading && (
        <>
          <View style={defaultStyles.dividerContainer}>
            <View style={defaultStyles.divider} />
            <Text style={defaultStyles.dividerText}>OR</Text>
            <View style={defaultStyles.divider} />
          </View>

          {/* Google Button */}
          {config.enableGoogle && (
            <TouchableOpacity
              style={[
                defaultStyles.oauthButton,
                defaultStyles.googleButton,
              ]}
              onPress={handleGoogleSignIn}
            >
              <Text style={defaultStyles.googleButtonText}>
                Continue with Google
              </Text>
            </TouchableOpacity>
          )}

          {/* Apple Button (iOS Only) */}
          {config.enableApple && Platform.OS === 'ios' && (
            <TouchableOpacity
              style={[
                defaultStyles.oauthButton,
                defaultStyles.appleButton,
              ]}
              onPress={handleAppleSignIn}
            >
              <Text style={defaultStyles.appleButtonText}>
                Continue with Apple
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
    marginBottom: 8, // Reduced slightly to make room for validation text
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
  
  errorText: { color: 'red', marginBottom: 12, fontSize: 14, textAlign: 'center' },
  validationText: { color: 'red', fontSize: 12, marginBottom: 10, marginLeft: 4, marginTop: -4 },

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