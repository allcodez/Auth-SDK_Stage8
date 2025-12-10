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
var __importStar = (this && this.__importStar) || (function() {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function(o) {
            var ar = [];
            for (var k in o)
                if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null)
            for (var k = ownKeys(mod), i = 0; i < k.length; i++)
                if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function(mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthProvider = void 0;
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const app_1 = require("firebase/app");
// 1. Standard Imports (Added inMemoryPersistence)
const auth_1 = require("firebase/auth");
// 2. The Hack: Import for getReactNativePersistence
const firebaseAuth = __importStar(require("firebase/auth"));
// @ts-ignore
const getReactNativePersistence = firebaseAuth.getReactNativePersistence;
const async_storage_1 = __importDefault(require("@react-native-async-storage/async-storage"));
const google_signin_1 = require("@react-native-google-signin/google-signin");
const AppleAuthentication = __importStar(require("expo-apple-authentication"));
const Crypto = __importStar(require("expo-crypto"));
const errors_1 = require("../errors");
const AuthContext_1 = require("./AuthContext");
const types_1 = require("../types");
const AuthProvider = ({ config, children }) => {
    const [user, setUser] = (0, react_1.useState)(null);
    const [status, setStatus] = (0, react_1.useState)(types_1.AuthStatus.LOADING);
    const [error, setError] = (0, react_1.useState)(null);
    const [firebaseAuthInstance, setFirebaseAuthInstance] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        let app;
        let auth;
        if (!(0, app_1.getApps)().length) {
            // 1. Initialize App
            app = (0, app_1.initializeApp)({
                apiKey: config.apiKey,
                authDomain: config.authDomain,
                projectId: config.projectId,
                storageBucket: config.storageBucket,
                messagingSenderId: config.messagingSenderId,
                appId: config.appId,
            });
            const selectedPersistence = config.persistence === 'memory' ?
                auth_1.inMemoryPersistence :
                getReactNativePersistence(async_storage_1.default);
            auth = (0, auth_1.initializeAuth)(app, {
                persistence: selectedPersistence
                persistence: selectedPersistence
            });
        } else {
            app = (0, app_1.getApp)();
            auth = (0, auth_1.getAuth)(app);
        }
        setFirebaseAuthInstance(auth);
        if (config.enableGoogle && config.googleWebClientId) {
            try {
                google_signin_1.GoogleSignin.configure({
                    webClientId: config.googleWebClientId,
                    offlineAccess: true,
                    iosClientId: config.googleIOSClientId,
                });
                console.log('✅ Google Sign-In configured successfully');
            } catch (err) {
                console.error('❌ Google Sign-In configuration failed:', err);
            }
        }
        const unsubscribe = (0, auth_1.onAuthStateChanged)(auth, async(fbUser) => {
            if (fbUser) {
                try {
                    const token = await fbUser.getIdToken();
                    setUser({
                        uid: fbUser.uid,
                        email: fbUser.email,
                        displayName: fbUser.displayName,
                        photoURL: fbUser.photoURL,
                        emailVerified: fbUser.emailVerified,
                        token: token
                    });
                    setStatus(types_1.AuthStatus.AUTHENTICATED);
                } catch (tokenError) {
                    console.error('Token retrieval error:', tokenError);
                    setStatus(types_1.AuthStatus.TOKEN_EXPIRED);
                }
            } else {
                setUser(null);
                setStatus(types_1.AuthStatus.UNAUTHENTICATED);
            }
        }, (err) => {
            console.error("Auth State Error:", err);
            setStatus(types_1.AuthStatus.UNAUTHENTICATED);
        });
        return () => unsubscribe();
    }, [config]);
    const signInWithEmail = async(email, pass) => {
        if (!firebaseAuthInstance)
            return;
        try {
            setError(null);
            setStatus(types_1.AuthStatus.LOADING);
            await (0, auth_1.signInWithEmailAndPassword)(firebaseAuthInstance, email, pass);
        } catch (err) {
            const mappedError = (0, errors_1.mapFirebaseError)(err);
            setError(mappedError);
            setStatus(types_1.AuthStatus.UNAUTHENTICATED);
            throw mappedError;
        }
    };
    const signUpWithEmail = async(email, pass) => {
        if (!firebaseAuthInstance)
            return;
        try {
            setError(null);
            setStatus(types_1.AuthStatus.LOADING);
            await (0, auth_1.createUserWithEmailAndPassword)(firebaseAuthInstance, email, pass);
        } catch (err) {
            const mappedError = (0, errors_1.mapFirebaseError)(err);
            setError(mappedError);
            setStatus(types_1.AuthStatus.UNAUTHENTICATED);
            throw mappedError;
        }
    };
    const signInWithGoogle = async() => {
        if (!firebaseAuthInstance) {
            throw new Error('Firebase not initialized');
        }
        if (!config.enableGoogle || !config.googleWebClientId) {
            const configError = {
                code: types_1.AuthErrorCode.CONFIG_ERROR,
                message: 'Google Sign-In is not enabled or configured. Please add googleWebClientId to your AuthConfig.',
            };
            setError(configError);
            throw configError;
        }
        try {
            setError(null);
            setStatus(types_1.AuthStatus.LOADING);
            await google_signin_1.GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            const userInfo = await google_signin_1.GoogleSignin.signIn();
            const idToken = userInfo.data ? .idToken;
            if (!idToken) {
                throw new Error('No ID token received from Google Sign-In');
            }
            const credential = auth_1.GoogleAuthProvider.credential(idToken);
            await (0, auth_1.signInWithCredential)(firebaseAuthInstance, credential);
            console.log('✅ Google Sign-In successful');
        } catch (err) {
            console.error('❌ Google Sign-In Error:', err);
            let mappedError;
            if (err.code === 'SIGN_IN_CANCELLED') {
                mappedError = {
                    code: types_1.AuthErrorCode.GOOGLE_SIGN_IN_CANCELLED,
                    message: 'Google Sign-In was cancelled',
                    originalError: err
                };
                setStatus(types_1.AuthStatus.UNAUTHENTICATED);
                return;
            } else if (err.code === 'IN_PROGRESS') {
                mappedError = {
                    code: types_1.AuthErrorCode.GOOGLE_SIGN_IN_IN_PROGRESS,
                    message: 'Google Sign-In is already in progress',
                    originalError: err
                };
            } else if (err.code === 'PLAY_SERVICES_NOT_AVAILABLE') {
                mappedError = {
                    code: types_1.AuthErrorCode.GOOGLE_PLAY_SERVICES_NOT_AVAILABLE,
                    message: 'Google Play Services are not available. Please update Google Play Services.',
                    originalError: err
                };
            } else {
                mappedError = (0, errors_1.mapFirebaseError)(err);
            }
            setError(mappedError);
            setStatus(types_1.AuthStatus.UNAUTHENTICATED);
            throw mappedError;
        }
    };
    const signInWithApple = async() => {
        if (!firebaseAuthInstance) {
            throw new Error('Firebase not initialized');
        }
        if (react_native_1.Platform.OS !== 'ios') {
            const platformError = {
                code: types_1.AuthErrorCode.APPLE_SIGN_IN_NOT_SUPPORTED,
                message: 'Apple Sign-In is only available on iOS devices',
            };
            setError(platformError);
            throw platformError;
        }
        const isAvailable = await AppleAuthentication.isAvailableAsync();
        if (!isAvailable) {
            const availabilityError = {
                code: types_1.AuthErrorCode.APPLE_SIGN_IN_NOT_SUPPORTED,
                message: 'Apple Sign-In is not available on this device (requires iOS 13+)',
            };
            setError(availabilityError);
            throw availabilityError;
        }
        try {
            setError(null);
            setStatus(types_1.AuthStatus.LOADING);
            const nonce = Math.random().toString(36).substring(2, 10);
            const hashedNonce = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, nonce);
            const appleCredential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ],
                nonce: hashedNonce,
            });
            const { identityToken } = appleCredential;
            if (!identityToken) {
                throw new Error('No identity token received from Apple');
            }
            const provider = new auth_1.OAuthProvider('apple.com');
            const credential = provider.credential({
                idToken: identityToken,
                rawNonce: nonce,
            });
            await (0, auth_1.signInWithCredential)(firebaseAuthInstance, credential);
            console.log('✅ Apple Sign-In successful');
        } catch (err) {
            console.error('❌ Apple Sign-In Error:', err);
            if (err.code === 'ERR_REQUEST_CANCELED') {
                const cancelError = {
                    code: types_1.AuthErrorCode.APPLE_SIGN_IN_CANCELLED,
                    message: 'Apple Sign-In was cancelled',
                    originalError: err
                };
                setError(cancelError);
                setStatus(types_1.AuthStatus.UNAUTHENTICATED);
                return;
            }
            const mappedError = (0, errors_1.mapFirebaseError)(err);
            setError(mappedError);
            setStatus(types_1.AuthStatus.UNAUTHENTICATED);
            throw mappedError;
        }
    };
    const signInWithGoogle = async() => {
        if (!firebaseAuthInstance) {
            throw new Error('Firebase not initialized');
        }
        if (!config.enableGoogle || !config.googleWebClientId) {
            const configError = {
                code: types_1.AuthErrorCode.CONFIG_ERROR,
                message: 'Google Sign-In is not enabled or configured. Please add googleWebClientId to your AuthConfig.',
            };
            setError(configError);
            throw configError;
        }
        try {
            setError(null);
            setStatus(types_1.AuthStatus.LOADING);
            await google_signin_1.GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            const userInfo = await google_signin_1.GoogleSignin.signIn();
            const idToken = userInfo.data ? .idToken;
            if (!idToken) {
                throw new Error('No ID token received from Google Sign-In');
            }
            const credential = auth_1.GoogleAuthProvider.credential(idToken);
            await (0, auth_1.signInWithCredential)(firebaseAuthInstance, credential);
            console.log('✅ Google Sign-In successful');
        } catch (err) {
            console.error('❌ Google Sign-In Error:', err);
            let mappedError;
            if (err.code === 'SIGN_IN_CANCELLED') {
                mappedError = {
                    code: types_1.AuthErrorCode.GOOGLE_SIGN_IN_CANCELLED,
                    message: 'Google Sign-In was cancelled',
                    originalError: err
                };
                setStatus(types_1.AuthStatus.UNAUTHENTICATED);
                return;
            } else if (err.code === 'IN_PROGRESS') {
                mappedError = {
                    code: types_1.AuthErrorCode.GOOGLE_SIGN_IN_IN_PROGRESS,
                    message: 'Google Sign-In is already in progress',
                    originalError: err
                };
            } else if (err.code === 'PLAY_SERVICES_NOT_AVAILABLE') {
                mappedError = {
                    code: types_1.AuthErrorCode.GOOGLE_PLAY_SERVICES_NOT_AVAILABLE,
                    message: 'Google Play Services are not available. Please update Google Play Services.',
                    originalError: err
                };
            } else {
                mappedError = (0, errors_1.mapFirebaseError)(err);
            }
            setError(mappedError);
            setStatus(types_1.AuthStatus.UNAUTHENTICATED);
            throw mappedError;
        }
    };
    const signInWithApple = async() => {
        if (!firebaseAuthInstance) {
            throw new Error('Firebase not initialized');
        }
        if (react_native_1.Platform.OS !== 'ios') {
            const platformError = {
                code: types_1.AuthErrorCode.APPLE_SIGN_IN_NOT_SUPPORTED,
                message: 'Apple Sign-In is only available on iOS devices',
            };
            setError(platformError);
            throw platformError;
        }
        const isAvailable = await AppleAuthentication.isAvailableAsync();
        if (!isAvailable) {
            const availabilityError = {
                code: types_1.AuthErrorCode.APPLE_SIGN_IN_NOT_SUPPORTED,
                message: 'Apple Sign-In is not available on this device (requires iOS 13+)',
            };
            setError(availabilityError);
            throw availabilityError;
        }
        try {
            setError(null);
            setStatus(types_1.AuthStatus.LOADING);
            const nonce = Math.random().toString(36).substring(2, 10);
            const hashedNonce = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, nonce);
            const appleCredential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ],
                nonce: hashedNonce,
            });
            const { identityToken } = appleCredential;
            if (!identityToken) {
                throw new Error('No identity token received from Apple');
            }
            const provider = new auth_1.OAuthProvider('apple.com');
            const credential = provider.credential({
                idToken: identityToken,
                rawNonce: nonce,
            });
            await (0, auth_1.signInWithCredential)(firebaseAuthInstance, credential);
            console.log('✅ Apple Sign-In successful');
        } catch (err) {
            console.error('❌ Apple Sign-In Error:', err);
            if (err.code === 'ERR_REQUEST_CANCELED') {
                const cancelError = {
                    code: types_1.AuthErrorCode.APPLE_SIGN_IN_CANCELLED,
                    message: 'Apple Sign-In was cancelled',
                    originalError: err
                };
                setError(cancelError);
                setStatus(types_1.AuthStatus.UNAUTHENTICATED);
                return;
            }
            const mappedError = (0, errors_1.mapFirebaseError)(err);
            setError(mappedError);
            setStatus(types_1.AuthStatus.UNAUTHENTICATED);
            throw mappedError;
        }
    };
    const signOut = async() => {
        try {
            if (firebaseAuthInstance) {
                await firebaseAuthInstance.signOut();
            }
            if (config.enableGoogle) {
                try {
                    await google_signin_1.GoogleSignin.signOut();
                } catch (googleSignOutError) {
                    console.log('Google sign-out skipped or failed:', googleSignOutError);
                }
            }
            console.log('✅ Sign out successful');
        } catch (err) {
            console.error('❌ Sign out error:', err);
            setUser(null);
            setStatus(types_1.AuthStatus.UNAUTHENTICATED);
        }
    };
    const clearError = () => setError(null);
    const value = (0, react_1.useMemo)(() => ({
        user,
        status,
        error,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        signInWithApple,
        signOut,
        clearError
    }), [user, status, error, firebaseAuthInstance]);
    return (react_1.default.createElement(AuthContext_1.AuthContext.Provider, { value: value }, children));
};
exports.AuthProvider = AuthProvider;