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
const react_native_safe_area_context_1 = require("react-native-safe-area-context");
const LoginForm_1 = require("./LoginForm");
const SignUpForm_1 = require("./SignUpForm");
const AuthScreen = ({ styles: userStyles, titles, showPasswordHints = true }) => {
    const [view, setView] = (0, react_1.useState)('login');
    const isLogin = view === 'login';
    return (react_1.default.createElement(react_native_safe_area_context_1.SafeAreaView, { style: [defaultStyles.safeArea, userStyles?.container] },
        react_1.default.createElement(react_native_1.KeyboardAvoidingView, { behavior: react_native_1.Platform.OS === "ios" ? "padding" : "height", style: { flex: 1 } },
            react_1.default.createElement(react_native_1.ScrollView, { contentContainerStyle: defaultStyles.scrollContainer, keyboardShouldPersistTaps: "handled" },
                react_1.default.createElement(react_native_1.View, { style: defaultStyles.innerContainer },
                    react_1.default.createElement(react_native_1.View, { style: [defaultStyles.header, userStyles?.header] },
                        react_1.default.createElement(react_native_1.Text, { style: [defaultStyles.title, userStyles?.title] }, isLogin
                            ? (titles?.loginTitle || 'Welcome Back')
                            : (titles?.signupTitle || 'Create Account')),
                        react_1.default.createElement(react_native_1.Text, { style: [defaultStyles.subtitle, userStyles?.subtitle] }, isLogin
                            ? (titles?.loginSubtitle || 'Sign in to continue')
                            : (titles?.signupSubtitle || 'Sign up to get started'))),
                    isLogin
                        ? react_1.default.createElement(LoginForm_1.LoginForm, { styles: userStyles })
                        : react_1.default.createElement(SignUpForm_1.SignUpForm, { styles: userStyles, showHints: showPasswordHints }),
                    react_1.default.createElement(react_native_1.View, { style: [defaultStyles.footer, userStyles?.footer] },
                        react_1.default.createElement(react_native_1.Text, { style: [defaultStyles.footerText, userStyles?.footerText] }, isLogin ? "Don't have an account?" : "Already have an account?"),
                        react_1.default.createElement(react_native_1.TouchableOpacity, { onPress: () => setView(isLogin ? 'signup' : 'login') },
                            react_1.default.createElement(react_native_1.Text, { style: [defaultStyles.linkText, userStyles?.linkText] }, isLogin ? ' Sign Up' : ' Sign In'))))))));
};
exports.AuthScreen = AuthScreen;
const defaultStyles = react_native_1.StyleSheet.create({
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
