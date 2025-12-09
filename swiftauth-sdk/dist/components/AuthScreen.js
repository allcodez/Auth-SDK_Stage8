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
exports.AuthScreen = void 0;
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const LoginForm_1 = require("./LoginForm");
const SignUpForm_1 = require("./SignUpForm");
const react_native_safe_area_context_1 = require("react-native-safe-area-context");
const AuthScreen = () => {
    const [view, setView] = (0, react_1.useState)('login');
    return (react_1.default.createElement(react_native_safe_area_context_1.SafeAreaView, { style: styles.safeArea },
        react_1.default.createElement(react_native_1.View, { style: styles.container },
            react_1.default.createElement(react_native_1.View, { style: styles.header },
                react_1.default.createElement(react_native_1.Text, { style: styles.title }, view === 'login' ? 'Welcome Back' : 'Create Account'),
                react_1.default.createElement(react_native_1.Text, { style: styles.subtitle }, view === 'login' ? 'Sign in to continue' : 'Sign up to get started')),
            view === 'login' ? react_1.default.createElement(LoginForm_1.LoginForm, null) : react_1.default.createElement(SignUpForm_1.SignUpForm, null),
            react_1.default.createElement(react_native_1.View, { style: styles.footer },
                react_1.default.createElement(react_native_1.Text, { style: styles.footerText }, view === 'login' ? "Don't have an account?" : "Already have an account?"),
                react_1.default.createElement(react_native_1.TouchableOpacity, { onPress: () => setView(view === 'login' ? 'signup' : 'login') },
                    react_1.default.createElement(react_native_1.Text, { style: styles.linkText }, view === 'login' ? ' Sign Up' : ' Sign In'))))));
};
exports.AuthScreen = AuthScreen;
const styles = react_native_1.StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#fff' },
    container: { flex: 1, justifyContent: 'center', padding: 24 },
    header: { marginBottom: 32, alignItems: 'center' },
    title: { fontSize: 28, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 8 },
    subtitle: { fontSize: 16, color: '#666' },
    footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
    footerText: { color: '#666', fontSize: 14 },
    linkText: { color: '#007AFF', fontWeight: '600', fontSize: 14 },
});
