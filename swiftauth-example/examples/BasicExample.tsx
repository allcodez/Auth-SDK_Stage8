import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AuthScreen, useAuth } from 'swiftauth-sdk';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  onBack: () => void;
}

export const BasicExample = ({ onBack }: Props) => {
  const { user, signOut } = useAuth();

  if (user) {
    return (
      <View style={styles.container}>
        <View style={styles.badgeContainer}>
          <Ionicons name="checkmark-circle" size={14} color="#166534" />
          <Text style={styles.badgeText}>Basic Example</Text>
        </View>
        <Text style={styles.title}>You're Signed In!</Text>
        <Text style={styles.email}>{user.email}</Text>

        <TouchableOpacity style={styles.button} onPress={() => signOut()}>
          <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={16} color="#007AFF" />
          <Text style={styles.backText}>Back to Examples</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity style={styles.floatingBack} onPress={onBack}>
        <Ionicons name="arrow-back" size={16} color="#007AFF" />
        <Text style={styles.floatingBackText}>Examples</Text>
      </TouchableOpacity>
      <AuthScreen />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 24,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dcfce7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 24,
    gap: 6,
  },
  badgeText: {
    color: '#166534',
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    gap: 4,
  },
  backText: {
    color: '#007AFF',
    fontSize: 14,
  },
  floatingBack: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 100,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  floatingBackText: {
    color: '#007AFF',
    fontWeight: '600',
  },
});
