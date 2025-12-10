"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignUpForm = void 0;
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const useAuth_1 = require("../hooks/useAuth");
const types_1 = require("../types");
const PasswordInput_1 = require("./PasswordInput");
const SignUpForm = ({ styles: userStyles, showHints = true }) => {
    const { signUpWithEmail, signInWithGoogle, signInWithApple, status, error } = (0, useAuth_1.useAuth)();
    const [email, setEmail] = (0, react_1.useState)('');
    const [password, setPassword] = (0, react_1.useState)('');
    const [confirmPassword, setConfirmPassword] = (0, react_1.useState)('');
    const [validationError, setValidationError] = (0, react_1.useState)(null);
    // Password Requirements Logic
    const requirements = [
        { label: "At least 6 characters", met: password.length >= 6 },
        { label: "Contains a number", met: /\d/.test(password) },
        { label: "Passwords match", met: password.length > 0 && password === confirmPassword }
    ];
    const handleSignUp = async () => {
        if (password !== confirmPassword) {
            setValidationError("Passwords do not match.");
            return;
        }
        if (password.length < 6) {
            setValidationError("Password is too short.");
            return;
        }
        setValidationError(null);
        try {
            await signUpWithEmail(email, password);
        }
        catch (e) { }
    };
    const handleGoogleSignIn = async () => {
        try {
            await signInWithGoogle();
        }
        catch (e) {
            console.error('Google Sign-In Error:', e);
        }
    };
    const handleAppleSignIn = async () => {
        try {
            await signInWithApple();
        }
        catch (e) {
            console.error('Apple Sign-In Error:', e);
        }
    };
    const isLoading = status === types_1.AuthStatus.LOADING;
    const displayError = validationError || (error ? error.message : null);
    return (react_1.default.createElement(react_native_1.View, { style: [defaultStyles.container, userStyles?.container] },
        displayError && (react_1.default.createElement(react_native_1.Text, { style: [defaultStyles.errorText, userStyles?.errorText] }, displayError)),
        react_1.default.createElement(react_native_1.TextInput, { style: [defaultStyles.input, userStyles?.input], placeholder: "Email", value: email, onChangeText: setEmail, autoCapitalize: "none", keyboardType: "email-address", placeholderTextColor: "#999" }),
        react_1.default.createElement(PasswordInput_1.PasswordInput, { styles: userStyles, placeholder: "Password", value: password, onChangeText: setPassword }),
        react_1.default.createElement(PasswordInput_1.PasswordInput, { styles: userStyles, placeholder: "Confirm Password", value: confirmPassword, onChangeText: setConfirmPassword }),
        showHints && password.length > 0 && (react_1.default.createElement(react_native_1.View, { style: [defaultStyles.hintContainer, userStyles?.hintContainer] }, requirements.map((req, index) => (react_1.default.createElement(react_native_1.View, { key: index, style: defaultStyles.hintRow },
            react_1.default.createElement(react_native_1.Text, { style: { fontSize: 14, marginRight: 6 } }, req.met ? "✅" : "⚪"),
            react_1.default.createElement(react_native_1.Text, { style: [
                    defaultStyles.hintText,
                    userStyles?.hintText,
                    req.met && (userStyles?.hintTextMet || defaultStyles.hintTextMet)
                ] }, req.label)))))),
        react_1.default.createElement(react_native_1.TouchableOpacity, { style: [
                defaultStyles.button,
                isLoading && defaultStyles.buttonDisabled,
                userStyles?.button
            ], onPress: handleSignUp, disabled: isLoading }, isLoading ? (react_1.default.createElement(react_native_1.ActivityIndicator, { color: userStyles?.loadingIndicatorColor || "#fff" })) : (react_1.default.createElement(react_native_1.Text, { style: [defaultStyles.buttonText, userStyles?.buttonText] }, "Create Account"))),
        react_1.default.createElement(react_native_1.View, { style: defaultStyles.dividerContainer },
            react_1.default.createElement(react_native_1.View, { style: defaultStyles.divider }),
            react_1.default.createElement(react_native_1.Text, { style: defaultStyles.dividerText }, "OR"),
            react_1.default.createElement(react_native_1.View, { style: defaultStyles.divider })),
        react_1.default.createElement(react_native_1.TouchableOpacity, { style: [defaultStyles.oauthButton, defaultStyles.googleButton], onPress: handleGoogleSignIn, disabled: isLoading },
            react_1.default.createElement(react_native_1.Text, { style: defaultStyles.googleButtonText }, isLoading ? '...' : '🔍 Sign up with Google')),
        react_native_1.Platform.OS === 'ios' && (react_1.default.createElement(react_native_1.TouchableOpacity, { style: [defaultStyles.oauthButton, defaultStyles.appleButton], onPress: handleAppleSignIn, disabled: isLoading },
            react_1.default.createElement(react_native_1.Text, { style: defaultStyles.appleButtonText }, isLoading ? '...' : 'Sign up with Apple')))));
};
exports.SignUpForm = SignUpForm;
const defaultStyles = react_native_1.StyleSheet.create({
    container: { width: '100%', marginVertical: 10 },
    input: {
        backgroundColor: '#f5f5f5',
        padding: 15,
        borderRadius: 8,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        fontSize: 16,
    },
    button: {
        backgroundColor: '#34C759',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
    },
    buttonDisabled: { backgroundColor: '#9ce4ae' },
    buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
    errorText: { color: 'red', marginBottom: 12, fontSize: 14 },
    // OAuth Styles
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    divider: { flex: 1, height: 1, backgroundColor: '#e0e0e0' },
    dividerText: { marginHorizontal: 16, color: '#666', fontSize: 14 },
    oauthButton: {
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    googleButton: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    googleButtonText: { color: '#000', fontSize: 16, fontWeight: '500' },
    appleButton: { backgroundColor: '#000' },
    appleButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
    // Password Hint Styles
    hintContainer: { marginBottom: 15, paddingLeft: 5 },
    hintRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
    hintText: { color: '#666', fontSize: 12 },
    hintTextMet: { color: '#34C759', fontWeight: '600' }
});
