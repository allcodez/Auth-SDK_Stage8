import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LoginForm } from './LoginForm';
import { SignUpForm } from './SignUpForm';
import { AuthScreenStyles } from '../types';

interface AuthScreenProps {
  styles?: AuthScreenStyles;
  titles?: {
    loginTitle?: string;
    loginSubtitle?: string;
    signupTitle?: string;
    signupSubtitle?: string;
  };
  showPasswordHints?: boolean; 
}

export const AuthScreen = ({ styles: userStyles, titles, showPasswordHints = true }: AuthScreenProps) => {
  const [view, setView] = useState<'login' | 'signup'>('login');

  const isLogin = view === 'login';

  return (
    <SafeAreaView style={[defaultStyles.safeArea, userStyles?.container]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={defaultStyles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={defaultStyles.innerContainer}>
            
            {/* Header Section */}
            <View style={[defaultStyles.header, userStyles?.header]}>
              <Text style={[defaultStyles.title, userStyles?.title]}>
                {isLogin 
                  ? (titles?.loginTitle || 'Welcome Back') 
                  : (titles?.signupTitle || 'Create Account')}
              </Text>
              <Text style={[defaultStyles.subtitle, userStyles?.subtitle]}>
                {isLogin 
                  ? (titles?.loginSubtitle || 'Sign in to continue') 
                  : (titles?.signupSubtitle || 'Sign up to get started')}
              </Text>
            </View>

            {/* Form Section */}
            {isLogin 
              ? <LoginForm styles={userStyles} /> 
              : <SignUpForm styles={userStyles} showHints={showPasswordHints} />
            }

            {/* Footer / Toggle Section */}
            <View style={[defaultStyles.footer, userStyles?.footer]}>
              <Text style={[defaultStyles.footerText, userStyles?.footerText]}>
                {isLogin ? "Don't have an account?" : "Already have an account?"}
              </Text>
              <TouchableOpacity onPress={() => setView(isLogin ? 'signup' : 'login')}>
                <Text style={[defaultStyles.linkText, userStyles?.linkText]}>
                  {isLogin ? ' Sign Up' : ' Sign In'}
                </Text>
              </TouchableOpacity>
            </View>
            
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const defaultStyles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  scrollContainer: { flexGrow: 1, justifyContent: 'center' },
  innerContainer: { padding: 24, width: '100%', maxWidth: 500, alignSelf: 'center' },
  
  header: { marginBottom: 32, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#666', textAlign: 'center' },
  
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24, marginBottom: 20 },
  footerText: { color: '#666', fontSize: 14 },
  linkText: { color: '#007AFF', fontWeight: '600', fontSize: 14, marginLeft: 5 },
});