import { ViewStyle, TextStyle } from 'react-native';

export interface AuthScreenStyles {
  // ... existing styles (container, header, etc.)
  container?: ViewStyle;
  header?: ViewStyle;
  footer?: ViewStyle;
  title?: TextStyle;
  subtitle?: TextStyle;
  footerText?: TextStyle;
  linkText?: TextStyle;
  errorText?: TextStyle;
  input?: TextStyle;
  button?: ViewStyle;
  buttonText?: TextStyle;
  loadingIndicatorColor?: string;

  // ✅ NEW: Password Specific Styles
  inputContainer?: ViewStyle;   // Wrapper for Input + Eye Button
  eyeIcon?: TextStyle;          // Style for the "Show/Hide" text
  
  // Hint List Styles
  hintContainer?: ViewStyle;    // Wrapper for the list
  hintText?: TextStyle;         // The text of the requirement
  hintTextMet?: TextStyle;      // Style when requirement is met (e.g., green)
}