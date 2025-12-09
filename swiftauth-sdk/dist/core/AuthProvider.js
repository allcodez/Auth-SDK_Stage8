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
exports.AuthProvider = void 0;
const react_1 = __importStar(require("react"));
const app_1 = require("firebase/app");
const auth_1 = require("firebase/auth");
const errors_1 = require("../errors");
const AuthContext_1 = require("./AuthContext");
const types_1 = require("../types");
const AuthProvider = ({ config, children }) => {
    const [user, setUser] = (0, react_1.useState)(null);
    const [status, setStatus] = (0, react_1.useState)(types_1.AuthStatus.LOADING);
    const [error, setError] = (0, react_1.useState)(null);
    const [firebaseAuth, setFirebaseAuth] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        let app;
        if (!(0, app_1.getApps)().length) {
            app = (0, app_1.initializeApp)({
                apiKey: config.apiKey,
                authDomain: config.authDomain,
                projectId: config.projectId,
                storageBucket: config.storageBucket,
                messagingSenderId: config.messagingSenderId,
                appId: config.appId,
            });
        }
        else {
            app = (0, app_1.getApp)();
        }
        const auth = (0, auth_1.getAuth)(app);
        setFirebaseAuth(auth);
        const unsubscribe = (0, auth_1.onAuthStateChanged)(auth, async (fbUser) => {
            if (fbUser) {
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
            }
            else {
                setUser(null);
                setStatus(types_1.AuthStatus.UNAUTHENTICATED);
            }
        }, (err) => {
            console.error("Auth State Error:", err);
            setStatus(types_1.AuthStatus.UNAUTHENTICATED);
        });
        return () => unsubscribe();
    }, [config]);
    const signInWithEmail = async (email, pass) => {
        if (!firebaseAuth)
            return;
        try {
            setError(null);
            setStatus(types_1.AuthStatus.LOADING);
            await (0, auth_1.signInWithEmailAndPassword)(firebaseAuth, email, pass);
        }
        catch (err) {
            const mappedError = (0, errors_1.mapFirebaseError)(err);
            setError(mappedError);
            setStatus(types_1.AuthStatus.UNAUTHENTICATED);
            throw mappedError;
        }
    };
    const signUpWithEmail = async (email, pass) => {
        if (!firebaseAuth)
            return;
        try {
            setError(null);
            setStatus(types_1.AuthStatus.LOADING);
            await (0, auth_1.createUserWithEmailAndPassword)(firebaseAuth, email, pass);
        }
        catch (err) {
            const mappedError = (0, errors_1.mapFirebaseError)(err);
            setError(mappedError);
            setStatus(types_1.AuthStatus.UNAUTHENTICATED);
            throw mappedError;
        }
    };
    const signInWithGoogle = async () => {
        console.log("Google Sign In - Not implemented yet");
    };
    const signInWithApple = async () => {
        console.log("Apple Sign In - Not implemented yet");
    };
    const signOut = async () => {
        if (firebaseAuth) {
            await firebaseAuth.signOut();
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
    }), [user, status, error, firebaseAuth]);
    return (react_1.default.createElement(AuthContext_1.AuthContext.Provider, { value: value }, children));
};
exports.AuthProvider = AuthProvider;
