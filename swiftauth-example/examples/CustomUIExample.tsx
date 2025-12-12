import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Alert
} from 'react-native';
import { useAuth, AuthStatus } from 'rn-swiftauth-sdk';
import {
  AuthException,
  InvalidCredentialsException,
  EmailAlreadyInUseException,
  NetworkException,
} from 'rn-swiftauth-sdk';
import { Ionicons, Feather } from '@expo/vector-icons';

interface Props {
  onBack: () => void;
}

export const CustomUIExample = ({ onBack }: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const {
    user,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signInWithApple,
    signOut,
    status,
    error,
    clearError
  } = useAuth();

  const isLoading = status === AuthStatus.LOADING;

  const handleSignOut = async () => {
    try {
      setLocalError(null);
      await signOut();
    } catch (e: any) {
      console.error('Sign out error:', e);
      Alert.alert(
        "Sign Out Failed",
        e instanceof AuthException ? e.message : "An unexpected error occurred."
      );
    }
  };

  const handleSubmit = async () => {
    clearError();
    setLocalError(null);

    try {
      if (isSignUp) {
        await signUpWithEmail({ email, password });
      } else {
        await signInWithEmail({ email, password });
      }
      setEmail('');
      setPassword('');
    } catch (e: any) {
      console.error('Auth error:', e);

      if (e instanceof InvalidCredentialsException) {
        setLocalError('Wrong email or passworddddddd. Please check your credentials and try again.');
      } else if (e instanceof EmailAlreadyInUseException) {
        setLocalError('This email is already registered. Try signing in instead.');
        setTimeout(() => {
          setIsSignUp(false);
          setLocalError(null);
        }, 3000);
      } else if (e instanceof NetworkException) {
        setLocalError('No internet connection. Please check your network and try again.');
      } else {
        if (e instanceof AuthException) {
          setLocalError(e.message);
        } else {
          setLocalError('Something went wrong. Please try again.');
        }
      }
    }
  };

  const handleGoogleSignIn = async () => {
    clearError();
    setLocalError(null);

    try {
      await signInWithGoogle();
    } catch (e: any) {
      console.error('Google Sign-In error:', e);

      if (e instanceof InvalidCredentialsException) {
        setLocalError('Google authentication failed. Please try again.');
      } else if (e instanceof EmailAlreadyInUseException) {
        setLocalError('This Google account is already linked to another user.');
      } else if (e instanceof NetworkException) {
        setLocalError('No internet connection. Please check your network.');
      } else {
        if (e instanceof AuthException) {
          if (e.message.toLowerCase().includes('cancel')) {
            console.log('User cancelled Google Sign-In');
            return;
          }
          setLocalError(`Google Sign-In failed: ${e.message}`);
        } else {
          setLocalError('Google Sign-In failed. Please try again.');
        }
      }
    }
  };

  const handleAppleSignIn = async () => {
    clearError();
    setLocalError(null);

    try {
      await signInWithApple();
    } catch (e: any) {
      console.error('Apple Sign-In error:', e);

      if (e instanceof InvalidCredentialsException) {
        setLocalError('Apple authentication failed. Please try again.');
      } else if (e instanceof EmailAlreadyInUseException) {
        setLocalError('This Apple ID is already linked to another account.');
      } else if (e instanceof NetworkException) {
        setLocalError('No internet connection. Please check your network.');
      } else {
        if (e instanceof AuthException) {
          if (e.message.toLowerCase().includes('cancel')) {
            console.log('User cancelled Apple Sign-In');
            return;
          }
          setLocalError(`Apple Sign-In failed: ${e.message}`);
        } else {
          setLocalError('Apple Sign-In failed. Please try again.');
        }
      }
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    clearError();
    setLocalError(null);
    setEmail('');
    setPassword('');
  };

  const displayError = localError || error?.message;
  const displayErrorCode = error?.code;

  if (user) {
    return (
      <View style={styles.profileContainer}>
        <TouchableOpacity style={styles.backButtonTop} onPress={onBack}>
          <Ionicons name="arrow-back" size={14} color="#f472b6" />
          <Text style={styles.backButtonTopText}>Examples</Text>
        </TouchableOpacity>

        <View style={styles.badgeContainer}>
          <Feather name="tool" size={14} color="#c4b5fd" />
          <Text style={styles.badgeText}>Custom UI Example</Text>
        </View>

        {user.photoURL ? (
          <Image source={{ uri: user.photoURL }} style={styles.avatarImage} />
        ) : (
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>
              {user.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || '?'}
            </Text>
          </View>
        )}

        <Text style={styles.profileTitle}>
          {user.displayName || 'Welcome!'}
        </Text>
        <Text style={styles.profileEmail}>{user.email}</Text>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>User ID</Text>
            <Text style={styles.infoValue} numberOfLines={1}>{user.uid}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Verified</Text>
            <View style={styles.verifiedRow}>
              {user.emailVerified ? (
                <Ionicons name="checkmark-circle" size={16} color="#22c55e" />
              ) : (
                <Ionicons name="time-outline" size={16} color="#f59e0b" />
              )}
              <Text style={[styles.infoValue, { color: user.emailVerified ? '#22c55e' : '#f59e0b' }]}>
                {user.emailVerified ? 'Yes' : 'Pending'}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity style={styles.backButtonTop} onPress={onBack}>
          <Ionicons name="arrow-back" size={14} color="#f472b6" />
          <Text style={styles.backButtonTopText}>Examples</Text>
        </TouchableOpacity>

        <View style={styles.badgeContainer}>
          <Feather name="tool" size={14} color="#c4b5fd" />
          <Text style={styles.badgeText}>Custom UI Example</Text>
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>
            {isSignUp ? 'Create Account' : 'Sign In'}
          </Text>
          <Text style={styles.subtitle}>
            {isSignUp
              ? 'Build something amazing today'
              : 'Welcome back, developer!'}
          </Text>
        </View>

        {displayError && (
          <View style={styles.errorBox}>
            <View style={styles.errorTitleRow}>
              {/* <Ionicons name="alert-circle" size={16} color="#fca5a5" /> */}
              {/* {displayErrorCode && (
                <Text style={styles.errorTitle}>{displayErrorCode}</Text>
              )} */}
            </View>
            <Text style={styles.errorMessage}>{displayError}</Text>
            <TouchableOpacity
              onPress={() => {
                clearError();
                setLocalError(null);
              }}
            >
              <Text style={styles.dismissError}>Dismiss</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="you@example.com"
            placeholderTextColor="#6b7280"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            editable={!isLoading}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Enter password"
              placeholderTextColor="#6b7280"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
              editable={!isLoading}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color="#94a3b8"
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading || !email || !password}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>
              {isSignUp ? 'Create Account' : 'Sign In'}
            </Text>
          )}
        </TouchableOpacity>

        <View style={styles.oauthDivider}>
          <View style={styles.oauthDividerLine} />
          <Text style={styles.oauthDividerText}>OR</Text>
          <View style={styles.oauthDividerLine} />
        </View>

        <TouchableOpacity
          style={[styles.oauthButton, styles.googleButton, isLoading && styles.oauthButtonDisabled]}
          onPress={handleGoogleSignIn}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          <Ionicons name="logo-google" size={18} color="#1a1a1a" />
          <Text style={styles.googleButtonText}>Continue with Google</Text>
        </TouchableOpacity>

        {Platform.OS === 'ios' && (
          <TouchableOpacity
            style={[styles.oauthButton, styles.appleButton, isLoading && styles.oauthButtonDisabled]}
            onPress={handleAppleSignIn}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <Ionicons name="logo-apple" size={20} color="#fff" />
            <Text style={styles.appleButtonText}>Continue with Apple</Text>
          </TouchableOpacity>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          </Text>
          <TouchableOpacity onPress={toggleMode}>
            <Text style={styles.footerLink}>
              {isSignUp ? ' Sign In' : ' Sign Up'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.codeHint}>
          <View style={styles.codeHintTitleRow}>
            <Ionicons name="bulb-outline" size={14} color="#fbbf24" />
            <Text style={styles.codeHintTitle}>Exception Handling:</Text>
          </View>
          <Text style={styles.codeText}>
            {`try {
  await signInWithEmail({ email, password });
} catch (e) {
  if (e instanceof InvalidCredentialsException) {
    // Handle wrong password
  } else if (e instanceof EmailAlreadyInUseException) {
    // Handle duplicate email
  } else if (e instanceof NetworkException) {
    // Handle network error
  } else {
    // Default: all other errors
  }
}`}
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    paddingTop: 80,
  },
  backButtonTop: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 100,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 4,
  },
  backButtonTopText: {
    color: '#f472b6',
    fontWeight: '600',
    fontSize: 13,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#1e1b4b',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 24,
    gap: 6,
  },
  badgeText: {
    color: '#c4b5fd',
    fontSize: 12,
    fontWeight: '600',
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: '#f8fafc',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#cbd5e1',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#f8fafc',
    borderWidth: 1,
    borderColor: '#334155',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  passwordInput: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: '#f8fafc',
  },
  eyeButton: {
    padding: 16,
  },
  submitButton: {
    backgroundColor: '#ec4899',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 17,
    letterSpacing: 0.3,
  },
  oauthDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  oauthDividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#334155',
  },
  oauthDividerText: {
    marginHorizontal: 16,
    color: '#64748b',
    fontSize: 13,
    fontWeight: '600',
  },
  oauthButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    gap: 10,
  },
  oauthButtonDisabled: {
    opacity: 0.5,
  },
  googleButton: {
    backgroundColor: '#fff',
  },
  googleButtonText: {
    color: '#1a1a1a',
    fontSize: 16,
    fontWeight: '600',
  },
  appleButton: {
    backgroundColor: '#000',
    borderWidth: 1,
    borderColor: '#333',
  },
  appleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  footerText: {
    color: '#64748b',
    fontSize: 14,
  },
  footerLink: {
    color: '#f472b6',
    fontWeight: '600',
    fontSize: 14,
  },
  errorBox: {
    backgroundColor: '#450a0a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#7f1d1d',
  },
  errorTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  errorTitle: {
    color: '#fca5a5',
    fontWeight: '700',
    fontSize: 14,
  },
  errorMessage: {
    color: '#fecaca',
    fontSize: 14,
    lineHeight: 20,
  },
  dismissError: {
    color: '#f87171',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
  },
  codeHint: {
    marginTop: 24,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  codeHintTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  codeHintTitle: {
    color: '#fbbf24',
    fontSize: 13,
    fontWeight: '600',
  },
  codeText: {
    color: '#a5f3fc',
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    lineHeight: 18,
  },
  profileContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    padding: 24,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ec4899',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 20,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: '#94a3b8',
    marginBottom: 24,
  },
  infoCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#334155',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    color: '#94a3b8',
    fontSize: 14,
  },
  infoValue: {
    color: '#f8fafc',
    fontSize: 14,
    fontWeight: '500',
    maxWidth: '60%',
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#334155',
    marginVertical: 8,
  },
  signOutButton: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f472b6',
  },
  signOutText: {
    color: '#f472b6',
    fontWeight: '600',
    fontSize: 16,
  },
});