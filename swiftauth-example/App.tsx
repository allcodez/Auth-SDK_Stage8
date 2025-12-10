import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { AuthProvider } from 'swiftauth-sdk';
import { firebaseConfig } from './firebaseConfig';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { BasicExample, StyledExample, CustomUIExample } from './examples';

type ExampleType = 'menu' | 'basic' | 'styled' | 'custom';

const ExampleSwitcher = () => {
  const [activeExample, setActiveExample] = useState<ExampleType>('menu');

  if (activeExample === 'basic') {
    return <BasicExample onBack={() => setActiveExample('menu')} />;
  }
  if (activeExample === 'styled') {
    return <StyledExample onBack={() => setActiveExample('menu')} />;
  }
  if (activeExample === 'custom') {
    return <CustomUIExample onBack={() => setActiveExample('menu')} />;
  }

  return (
    <View style={styles.menuContainer}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons name="flash" size={24} color="#fff" />
        </View>
        <Text style={styles.title}>SwiftAuth</Text>
        <Text style={styles.subtitle}>Select an implementation approach</Text>
      </View>

      <View style={styles.cardsContainer}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => setActiveExample('basic')}
          activeOpacity={0.7}
        >
          <View style={styles.cardLeft}>
            <View style={[styles.iconContainer, { backgroundColor: '#e8f5e9' }]}>
              <Ionicons name="checkmark" size={20} color="#2e7d32" />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Basic</Text>
              <Text style={styles.cardDescription}>Zero config, plug-and-play</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => setActiveExample('styled')}
          activeOpacity={0.7}
        >
          <View style={styles.cardLeft}>
            <View style={[styles.iconContainer, { backgroundColor: '#e3f2fd' }]}>
              <Ionicons name="color-palette-outline" size={20} color="#1565c0" />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Styled</Text>
              <Text style={styles.cardDescription}>Custom colors and typography</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => setActiveExample('custom')}
          activeOpacity={0.7}
        >
          <View style={styles.cardLeft}>
            <View style={[styles.iconContainer, { backgroundColor: '#fce4ec' }]}>
              <Feather name="code" size={18} color="#c2185b" />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Custom UI</Text>
              <Text style={styles.cardDescription}>Full control with hooks</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          All examples share the same AuthProvider
        </Text>
      </View>
    </View>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider config={firebaseConfig}>
        <ExampleSwitcher />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  menuContainer: {
    flex: 1,
    backgroundColor: '#fafafa',
    paddingHorizontal: 24,
    paddingTop: 80,
  },
  header: {
    marginBottom: 48,
  },
  logoContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: '#6b7280',
  },
  cardsContainer: {
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    gap: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  cardDescription: {
    fontSize: 13,
    color: '#9ca3af',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 24,
    right: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    color: '#9ca3af',
  },
});
