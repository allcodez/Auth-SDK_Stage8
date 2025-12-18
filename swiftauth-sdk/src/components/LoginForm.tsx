import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
  Alert
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
    sendPasswordReset,
    isLoading,
    error,
    config,
    clearError
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isResetMode, setIsResetMode] = useState(false); // ✅ 2. Mode Toggle State
  
  const [validationErrors, setValidationErrors] = useState<{ email?: string; password?: string }>({});

  // ✅ 3. Dynamic check: If resetting, we only need Email. If logging in, we need both.
  const isFormFilled = isResetMode 
    ? email.length > 0 
    : (email.length > 0 && password.length > 0);

  // ✅ 4. New Handler for Password Reset
  const handleResetPassword = async () => {
    setValidationErrors({});
    const emailErr = validateEmail(email);
    if (emailErr) {
      setValidationErrors({ email: emailErr });
      return;
    }

    try {
      await sendPasswordReset(email);
      Alert.alert(
        "Check your email", 
        "If an account exists with this email, a password reset link has been sent."
      );
      setIsResetMode(false); // Go back to login screen
    } catch (e) {
      console.log('Reset failed:', e);
    }
  };

  const handleLogin = async () => {
    setValidationErrors({});
    
    // Validate Inputs
    const emailErr = validateEmail(email);
    const passErr = validatePasswordLogin(password);

    if (emailErr || passErr) {
      setValidationErrors({
        email: emailErr || undefined,
        password: passErr || undefined
      });
      return;
    }

    try {
      await signInWithEmail({ email, password });
    } catch (e) { 
      console.log('Login failed:', e);
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


  const toggleResetMode = () => {
    setIsResetMode(!isResetMode);
    clearError();
    setValidationErrors({});

    setPassword('');
  };

  return (
    <View style={[defaultStyles.container, userStyles?.container]}>

      {error && (
        <Text style={[defaultStyles.errorText, userStyles?.errorText]}>
          {error.message}
        </Text>
      )}


      {isResetMode && (
        <Text style={defaultStyles.modeTitle}>Reset Password</Text>
      )}


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


      {!isResetMode && (
        <>
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


          <TouchableOpacity 
            style={defaultStyles.forgotPasswordContainer} 
            onPress={toggleResetMode}
            disabled={isLoading}
          >
            <Text style={[defaultStyles.forgotPasswordText, userStyles?.linkText]}>
              Forgot Password?
            </Text>
          </TouchableOpacity>
        </>
      )}


      <TouchableOpacity
        style={[
          defaultStyles.button,
          (isLoading || !isFormFilled) && defaultStyles.buttonDisabled,
          userStyles?.button
        ]}

        onPress={isResetMode ? handleResetPassword : handleLogin}
        disabled={isLoading || !isFormFilled}
      >
        {isLoading ? (
          <ActivityIndicator color={userStyles?.loadingIndicatorColor || "#fff"} />
        ) : (
          <Text style={[defaultStyles.buttonText, userStyles?.buttonText]}>
            {isResetMode ? "Send Reset Link" : "Sign In"}
          </Text>
        )}
      </TouchableOpacity>


      {isResetMode && (
        <TouchableOpacity 
          style={defaultStyles.cancelButton} 
          onPress={toggleResetMode}
          disabled={isLoading}
        >
          <Text style={defaultStyles.cancelButtonText}>Back to Sign In</Text>
        </TouchableOpacity>
      )}


      {!isResetMode && (config.enableGoogle || config.enableApple) && !isLoading && (
        <>
          <View style={defaultStyles.dividerContainer}>
            <View style={defaultStyles.divider} />
            <Text style={defaultStyles.dividerText}>OR</Text>
            <View style={defaultStyles.divider} />
          </View>

          {/* Google Button */}
          {config.enableGoogle && (
            <TouchableOpacity
              style={[defaultStyles.oauthButton, defaultStyles.googleButton]}
              onPress={handleGoogleSignIn}
            >
              <Text style={defaultStyles.googleButtonText}>Continue with Google</Text>
            </TouchableOpacity>
          )}

          {/* Apple Button (iOS Only) */}
          {config.enableApple && Platform.OS === 'ios' && (
            <TouchableOpacity
              style={[defaultStyles.oauthButton, defaultStyles.appleButton]}
              onPress={handleAppleSignIn}
            >
              <Text style={defaultStyles.appleButtonText}>Continue with Apple</Text>
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
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: { 
    backgroundColor: '#a0cfff',
    opacity: 0.7 
  },
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


  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 12,
    padding: 4,
  },
  forgotPasswordText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
  modeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
  },
  cancelButton: {
    marginTop: 16,
    alignItems: 'center',
    padding: 8,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
});