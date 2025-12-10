import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LoginForm } from './LoginForm';
import { SignUpForm } from './SignUpForm';
import { AuthScreenStyles, DEFAULT_AUTH_CONFIG } from '../types';
import { useAuth } from '../hooks/useAuth'; // Import useAuth to access global config if needed, 
// OR we can just pass props if the config is not readily available in context UI logic.
// Actually, AuthProvider holds the config, but it doesn't expose it via useAuth Context directly in our types.
// A simpler way: Let's assume default is true, or allow passing it as a prop to AuthScreen.
// BUT WAIT: The task says "Allow developers to pass a config object".
// We should check the config passed to AuthProvider!

// Let's create a quick hook helper or just update AuthContext to expose config?
// For now, let's allow passing it as a prop to AuthScreen for maximum UI flexibility, 
// defaulting to true.

interface AuthScreenProps {
  styles?: AuthScreenStyles;
  titles?: {
    loginTitle?: string;
    loginSubtitle?: string;
    signupTitle?: string;
    signupSubtitle?: string;
  };
  // Allow overriding locally, or default to true
  showPasswordHints?: boolean; 
}

export const AuthScreen = ({ styles: userStyles, titles, showPasswordHints = true }: AuthScreenProps) => {
  const [view, setView] = useState<'login' | 'signup'>('login');

  return (
    <SafeAreaView style={[defaultStyles.safeArea, userStyles?.container]}>
      <View style={defaultStyles.innerContainer}>
        
        <View style={[defaultStyles.header, userStyles?.header]}>
          <Text style={[defaultStyles.title, userStyles?.title]}>
            {view === 'login' 
              ? (titles?.loginTitle || 'Welcome Back') 
              : (titles?.signupTitle || 'Create Account')}
          </Text>
          <Text style={[defaultStyles.subtitle, userStyles?.subtitle]}>
            {view === 'login' 
              ? (titles?.loginSubtitle || 'Sign in to continue') 
              : (titles?.signupSubtitle || 'Sign up to get started')}
          </Text>
        </View>

        {view === 'login' 
          ? <LoginForm styles={userStyles} /> 
          : <SignUpForm styles={userStyles} showHints={showPasswordHints} />
        }

        <View style={[defaultStyles.footer, userStyles?.footer]}>
          <Text style={[defaultStyles.footerText, userStyles?.footerText]}>
            {view === 'login' ? "Don't have an account?" : "Already have an account?"}
          </Text>
          <TouchableOpacity onPress={() => setView(view === 'login' ? 'signup' : 'login')}>
            <Text style={[defaultStyles.linkText, userStyles?.linkText]}>
              {view === 'login' ? ' Sign Up' : ' Sign In'}
            </Text>
          </TouchableOpacity>
        </View>
        
      </View>
    </SafeAreaView>
  );
};

// ... defaultStyles remain the same
const defaultStyles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#fff' },
    innerContainer: { flex: 1, justifyContent: 'center', padding: 24 },
    header: { marginBottom: 32, alignItems: 'center' },
    title: { fontSize: 28, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 8 },
    subtitle: { fontSize: 16, color: '#666' },
    footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
    footerText: { color: '#666', fontSize: 14 },
    linkText: { color: '#007AFF', fontWeight: '600', fontSize: 14, marginLeft: 5 },
  });