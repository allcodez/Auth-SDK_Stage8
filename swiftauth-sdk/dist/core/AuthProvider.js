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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthProvider = void 0;
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const app_1 = require("firebase/app");
const FirebaseAuth = __importStar(require("firebase/auth"));
const async_storage_1 = __importDefault(require("@react-native-async-storage/async-storage"));
const google_signin_1 = require("@react-native-google-signin/google-signin");
const AppleAuthentication = __importStar(require("expo-apple-authentication"));
const Crypto = __importStar(require("expo-crypto"));
const errors_1 = require("../errors");
const AuthContext_1 = require("./AuthContext");
const types_1 = require("../types");
const getReactNativePersistence = FirebaseAuth.getReactNativePersistence;
const AuthProvider = ({ config, children }) => {
    const [user, setUser] = (0, react_1.useState)(null);
    const [status, setStatus] = (0, react_1.useState)(types_1.AuthStatus.LOADING);
    const [error, setError] = (0, react_1.useState)(null);
    const [firebaseAuthInstance, setFirebaseAuthInstance] = (0, react_1.useState)(null);
    const [isDataLoading, setIsDataLoading] = (0, react_1.useState)(true);
    // --- INITIALIZATION ---
    (0, react_1.useEffect)(() => {
        let app;
        let auth;
        if (!(0, app_1.getApps)().length) {
            app = (0, app_1.initializeApp)({
                apiKey: config.apiKey,
                authDomain: config.authDomain,
                projectId: config.projectId,
                storageBucket: config.storageBucket,
                messagingSenderId: config.messagingSenderId,
                appId: config.appId,
            });
            const selectedPersistence = config.persistence === 'memory'
                ? FirebaseAuth.inMemoryPersistence
                : getReactNativePersistence(async_storage_1.default);
            auth = FirebaseAuth.initializeAuth(app, {
                persistence: selectedPersistence
            });
        }
        else {
            app = (0, app_1.getApp)();
            auth = FirebaseAuth.getAuth(app);
        }
        setFirebaseAuthInstance(auth);
        if (config.enableGoogle && config.googleWebClientId) {
            try {
                google_signin_1.GoogleSignin.configure({
                    webClientId: config.googleWebClientId,
                    offlineAccess: true,
                    iosClientId: config.googleIOSClientId,
                });
                console.log('Google Sign-In configured successfully');
            }
            catch (err) {
                console.error('Google Sign-In configuration failed:', err);
            }
        }
        const unsubscribe = FirebaseAuth.onAuthStateChanged(auth, async (fbUser) => {
            try {
                if (fbUser) {
                    try {
                        const token = await fbUser.getIdToken(true);
                        setUser({
                            uid: fbUser.uid,
                            email: fbUser.email,
                            displayName: fbUser.displayName,
                            photoURL: fbUser.photoURL,
                            emailVerified: fbUser.emailVerified,
                            token: token
                        });
                        setStatus(types_1.AuthStatus.AUTHENTICATED);
                    }
                    catch (tokenError) {
                        console.error('Token retrieval error:', tokenError);
                        if (tokenError.code === types_1.ProviderErrorCodes.USER_TOKEN_EXPIRED ||
                            tokenError.code === types_1.ProviderErrorCodes.NULL_USER) {
                            setStatus(types_1.AuthStatus.TOKEN_EXPIRED);
                        }
                        else {
                            setStatus(types_1.AuthStatus.UNAUTHENTICATED);
                        }
                        setUser(null);
                    }
                }
                else {
                    setUser(null);
                    setStatus(types_1.AuthStatus.UNAUTHENTICATED);
                }
            }
            catch (err) {
                console.error("Auth State Error:", err);
                setStatus(types_1.AuthStatus.UNAUTHENTICATED);
            }
            finally {
                setIsDataLoading(false);
            }
        });
        return () => unsubscribe();
    }, [config]);
    // --- ACTIONS ---
    const signInWithEmail = async ({ email, password }) => {
        if (!firebaseAuthInstance)
            return;
        try {
            setError(null);
            setStatus(types_1.AuthStatus.LOADING);
            await FirebaseAuth.signInWithEmailAndPassword(firebaseAuthInstance, email, password);
        }
        catch (err) {
            const mapped = (0, errors_1.mapFirebaseError)(err);
            setError({ ...mapped, originalError: err });
            setStatus(types_1.AuthStatus.UNAUTHENTICATED);
            throw err;
        }
    };
    const signUpWithEmail = async ({ email, password }) => {
        if (!firebaseAuthInstance)
            return;
        try {
            setError(null);
            setStatus(types_1.AuthStatus.LOADING);
            await FirebaseAuth.createUserWithEmailAndPassword(firebaseAuthInstance, email, password);
        }
        catch (err) {
            const mapped = (0, errors_1.mapFirebaseError)(err);
            setError({ ...mapped, originalError: err });
            setStatus(types_1.AuthStatus.UNAUTHENTICATED);
            throw err;
        }
    };
    const signInWithGoogle = async () => {
        if (!firebaseAuthInstance)
            throw new Error('Firebase not initialized');
        if (!config.enableGoogle || !config.googleWebClientId) {
            setError({ code: types_1.AuthErrorCode.CONFIG_ERROR, message: 'Google Auth not configured. Missing googleWebClientId.' });
            return;
        }
        try {
            setError(null);
            setStatus(types_1.AuthStatus.LOADING);
            await google_signin_1.GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            const userInfo = await google_signin_1.GoogleSignin.signIn();
            const idToken = userInfo.data?.idToken;
            if (!idToken)
                throw new Error('No ID token received from Google Sign-In');
            const credential = FirebaseAuth.GoogleAuthProvider.credential(idToken);
            await FirebaseAuth.signInWithCredential(firebaseAuthInstance, credential);
            console.log('Google Sign-In successful');
        }
        catch (err) {
            console.error('Google Sign-In Error:', err);
            let mappedError;
            if (err.code === types_1.ProviderErrorCodes.GOOGLE_CANCELLED) {
                mappedError = {
                    code: types_1.AuthErrorCode.GOOGLE_SIGN_IN_CANCELLED,
                    message: 'Google Sign-In was cancelled',
                    originalError: err
                };
                setStatus(types_1.AuthStatus.UNAUTHENTICATED);
                return;
            }
            else if (err.code === types_1.ProviderErrorCodes.GOOGLE_IN_PROGRESS) {
                mappedError = {
                    code: types_1.AuthErrorCode.GOOGLE_SIGN_IN_IN_PROGRESS,
                    message: 'Google Sign-In is already in progress',
                    originalError: err
                };
            }
            else if (err.code === types_1.ProviderErrorCodes.GOOGLE_PLAY_UNAVAILABLE) {
                mappedError = {
                    code: types_1.AuthErrorCode.GOOGLE_PLAY_SERVICES_NOT_AVAILABLE,
                    message: 'Google Play Services are not available. Please update Google Play Services.',
                    originalError: err
                };
            }
            else {
                mappedError = (0, errors_1.mapFirebaseError)(err);
            }
            setError({ ...mappedError, originalError: err });
            setStatus(types_1.AuthStatus.UNAUTHENTICATED);
            throw mappedError;
        }
    };
    const signInWithApple = async () => {
        if (!firebaseAuthInstance)
            throw new Error('Firebase not initialized');
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
            if (!identityToken)
                throw new Error('No identity token received from Apple');
            const provider = new FirebaseAuth.OAuthProvider('apple.com');
            const credential = provider.credential({
                idToken: identityToken,
                rawNonce: nonce,
            });
            await FirebaseAuth.signInWithCredential(firebaseAuthInstance, credential);
            console.log('Apple Sign-In successful');
        }
        catch (err) {
            console.error('Apple Sign-In Error:', err);
            if (err.code === types_1.ProviderErrorCodes.APPLE_CANCELLED) {
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
            setError({ ...mappedError, originalError: err });
            setStatus(types_1.AuthStatus.UNAUTHENTICATED);
            throw mappedError;
        }
    };
    const signOut = async () => {
        try {
            if (firebaseAuthInstance) {
                await firebaseAuthInstance.signOut();
            }
            if (config.enableGoogle) {
                try {
                    await google_signin_1.GoogleSignin.signOut();
                }
                catch (googleSignOutError) {
                    console.log('Google sign-out skipped or failed:', googleSignOutError);
                }
            }
            console.log('Sign out successful');
        }
        catch (err) {
            console.error('Sign out error:', err);
            setUser(null);
            setStatus(types_1.AuthStatus.UNAUTHENTICATED);
        }
    };
    const clearError = () => setError(null);
    const value = (0, react_1.useMemo)(() => ({
        user,
        status,
        isLoading: isDataLoading || status === types_1.AuthStatus.LOADING,
        error,
        config,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        signInWithApple,
        signOut,
        clearError
    }), [user, status, isDataLoading, error, config, firebaseAuthInstance]);
    return (react_1.default.createElement(AuthContext_1.AuthContext.Provider, { value: value }, children));
};
exports.AuthProvider = AuthProvider;
