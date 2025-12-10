import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { AuthProvider } from 'swiftauth-sdk';
import { firebaseConfig } from './firebaseConfig';
import { SafeAreaProvider } from 'react-native-safe-area-context';
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
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.logo}>⚡️</Text>
        <Text style={styles.title}>SwiftAuth SDK</Text>
        <Text style={styles.subtitle}>Choose an implementation approach</Text>
      </View>

      <View style={styles.cardsContainer}>
        <TouchableOpacity
          style={[styles.card, styles.cardBasic]}
          onPress={() => setActiveExample('basic')}
          activeOpacity={0.8}
        >
          <Text style={styles.cardEmoji}>✅</Text>
          <Text style={styles.cardTitle}>Basic</Text>
          <Text style={styles.cardDescription}>
            Plug-and-play AuthScreen{'\n'}Zero configuration needed
          </Text>
          <View style={[styles.cardBadge, { backgroundColor: '#dcfce7' }]}>
            <Text style={[styles.cardBadgeText, { color: '#166534' }]}>Easiest</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, styles.cardStyled]}
          onPress={() => setActiveExample('styled')}
          activeOpacity={0.8}
        >
          <Text style={styles.cardEmoji}>🎨</Text>
          <Text style={styles.cardTitle}>Styled</Text>
          <Text style={styles.cardDescription}>
            Custom colors & typography{'\n'}Your brand, our components
          </Text>
          <View style={[styles.cardBadge, { backgroundColor: '#dbeafe' }]}>
            <Text style={[styles.cardBadgeText, { color: '#1e40af' }]}>Recommended</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, styles.cardCustom]}
          onPress={() => setActiveExample('custom')}
          activeOpacity={0.8}
        >
          <Text style={styles.cardEmoji}>🛠️</Text>
          <Text style={styles.cardTitle}>Custom UI</Text>
          <Text style={styles.cardDescription}>
            Build your own interface{'\n'}Full control with hooks
          </Text>
          <View style={[styles.cardBadge, { backgroundColor: '#fae8ff' }]}>
            <Text style={[styles.cardBadgeText, { color: '#86198f' }]}>Advanced</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          All examples use the same AuthProvider & Firebase config
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
    backgroundColor: '#0f172a',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#f8fafc',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
  },
  cardsContainer: {
    flex: 1,
    gap: 16,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  cardBasic: {
    backgroundColor: '#14532d',
    borderWidth: 1,
    borderColor: '#22c55e',
  },
  cardStyled: {
    backgroundColor: '#1e3a5f',
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  cardCustom: {
    backgroundColor: '#4a1d6a',
    borderWidth: 1,
    borderColor: '#a855f7',
  },
  cardEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 14,
    color: 'rgba(248, 250, 252, 0.7)',
    lineHeight: 20,
  },
  cardBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  cardBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  footer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
  },
});
