import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, TextInputProps } from 'react-native';
import { AuthScreenStyles } from '../types';

interface PasswordInputProps extends TextInputProps {
  styles?: AuthScreenStyles;
}

export const PasswordInput = ({ styles, ...props }: PasswordInputProps) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <View style={[defaultStyles.container, styles?.inputContainer]}>
      <TextInput
        {...props}
        style={[defaultStyles.input, styles?.input, { flex: 1, borderWidth: 0, marginBottom: 0 }]}
        secureTextEntry={!isVisible}
        placeholderTextColor="#999"
      />
      <TouchableOpacity 
        onPress={() => setIsVisible(!isVisible)} 
        style={defaultStyles.iconContainer}
      >
        {/* Using Unicode characters to avoid icon library dependencies */}
        <Text style={[defaultStyles.iconText, styles?.eyeIcon]}>
          {isVisible ? "👁️‍🗨️" : "👁️"} 
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const defaultStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 12,
    overflow: 'hidden',
  },
  input: {
    padding: 15,
    fontSize: 16,
    backgroundColor: 'transparent',
  },
  iconContainer: {
    padding: 15,
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 18,
  }
});