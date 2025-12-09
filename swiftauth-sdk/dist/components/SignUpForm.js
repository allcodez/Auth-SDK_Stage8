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
const SignUpForm = () => {
    const { signUpWithEmail, status, error } = (0, useAuth_1.useAuth)();
    const [email, setEmail] = (0, react_1.useState)('');
    const [password, setPassword] = (0, react_1.useState)('');
    const handleSignUp = async () => {
        try {
            await signUpWithEmail(email, password);
        }
        catch (e) {
        }
    };
    const isLoading = status === types_1.AuthStatus.LOADING;
    return (react_1.default.createElement(react_native_1.View, { style: styles.container },
        error && react_1.default.createElement(react_native_1.Text, { style: styles.errorText }, error.message),
        react_1.default.createElement(react_native_1.TextInput, { style: styles.input, placeholder: "Email", value: email, onChangeText: setEmail, autoCapitalize: "none", keyboardType: "email-address" }),
        react_1.default.createElement(react_native_1.TextInput, { style: styles.input, placeholder: "Password", value: password, onChangeText: setPassword, secureTextEntry: true }),
        react_1.default.createElement(react_native_1.TouchableOpacity, { style: [styles.button, isLoading && styles.buttonDisabled], onPress: handleSignUp, disabled: isLoading }, isLoading ? (react_1.default.createElement(react_native_1.ActivityIndicator, { color: "#fff" })) : (react_1.default.createElement(react_native_1.Text, { style: styles.buttonText }, "Create Account")))));
};
exports.SignUpForm = SignUpForm;
const styles = react_native_1.StyleSheet.create({
    container: { width: '100%', marginVertical: 10 },
    input: {
        backgroundColor: '#f5f5f5',
        padding: 15,
        borderRadius: 8,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0',
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
});
