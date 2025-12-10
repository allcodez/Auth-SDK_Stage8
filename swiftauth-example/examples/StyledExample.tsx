import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AuthScreen, useAuth } from 'swiftauth-sdk';

interface Props {
  onBack: () => void;
}

export const StyledExample = ({ onBack }: Props) => {
  const { user, signOut } = useAuth();

  if (user) {
    return (
      <View style={styles.container}>
        <Text style={styles.badge}>🎨 Styled Example</Text>
        <Text style={styles.title}>Welcome back!</Text>
        <Text style={styles.email}>{user.email}</Text>
        
        <TouchableOpacity style={styles.button} onPress={() => signOut()}>
          <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backText}>← Back to Examples</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity style={styles.floatingBack} onPress={onBack}>
        <Text style={styles.floatingBackText}>← Examples</Text>
      </TouchableOpacity>
      
      <AuthScreen 
        titles={{
          loginTitle: 'Welcome Back',
          loginSubtitle: 'Sign in to continue your journey',
          signupTitle: 'Join SwiftAuth',
          signupSubtitle: 'Create your account in seconds',
        }}
        showPasswordHints={true}
        styles={{
          container: { 
            backgroundColor: '#f0f9ff',
          },
          header: {
            marginBottom: 40,
          },
          title: { 
            fontSize: 32,
            fontWeight: '800',
            color: '#0c4a6e',
            letterSpacing: -0.5,
          },
          subtitle: { 
            fontSize: 15,
            color: '#0369a1',
            letterSpacing: 0.3,
          },
          input: {
            backgroundColor: '#ffffff',
            borderColor: '#bae6fd',
            borderWidth: 2,
            borderRadius: 12,
            fontSize: 16,
            color: '#0c4a6e',
          },
          inputContainer: {
            marginBottom: 16,
          },
          eyeIcon: {
            color: '#0284c7',
          },
          button: {
            backgroundColor: '#0284c7',
            borderRadius: 12,
            paddingVertical: 16,
          },
          buttonText: {
            fontSize: 17,
            fontWeight: '700',
            letterSpacing: 0.5,
          },
          footerText: {
            color: '#64748b',
            fontSize: 14,
          },
          linkText: {
            color: '#0284c7',
            fontWeight: '700',
            fontSize: 14,
          },
          errorText: {
            color: '#dc2626',
            fontSize: 13,
            textAlign: 'center',
          },
          hintContainer: {
            marginTop: 8,
            paddingHorizontal: 4,
          },
          hintText: {
            color: '#94a3b8',
            fontSize: 12,
          },
          hintTextMet: {
            color: '#22c55e',
            fontSize: 12,
          },
          loadingIndicatorColor: '#0284c7',
        }} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
    padding: 24,
  },
  badge: {
    backgroundColor: '#dbeafe',
    color: '#1e40af',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0c4a6e',
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    color: '#0369a1',
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#0284c7',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  backButton: {
    marginTop: 24,
  },
  backText: {
    color: '#0284c7',
    fontSize: 14,
  },
  floatingBack: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 100,
    backgroundColor: 'rgba(240,249,255,0.95)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  floatingBackText: {
    color: '#0284c7',
    fontWeight: '600',
  },
});
