import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LoginForm } from './LoginForm';
import { SignUpForm } from './SignUpForm';
import { SafeAreaView } from 'react-native-safe-area-context';


export const AuthScreen = () => {
  // Toggle state: 'login' or 'signup'
  const [view, setView] = useState<'login' | 'signup'>('login');

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {view === 'login' ? 'Welcome Back' : 'Create Account'}
          </Text>
          <Text style={styles.subtitle}>
            {view === 'login' ? 'Sign in to continue' : 'Sign up to get started'}
          </Text>
        </View>

        {/* Render the appropriate form */}
        {view === 'login' ? <LoginForm /> : <SignUpForm />}

        {/* Toggle Button */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {view === 'login' ? "Don't have an account?" : "Already have an account?"}
          </Text>
          <TouchableOpacity onPress={() => setView(view === 'login' ? 'signup' : 'login')}>
            <Text style={styles.linkText}>
              {view === 'login' ? ' Sign Up' : ' Sign In'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  header: { marginBottom: 32, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#666' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  footerText: { color: '#666', fontSize: 14 },
  linkText: { color: '#007AFF', fontWeight: '600', fontSize: 14 },
});