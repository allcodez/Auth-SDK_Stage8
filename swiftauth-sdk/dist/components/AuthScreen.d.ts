import React from 'react';
import { AuthScreenStyles } from '../types';
interface AuthScreenProps {
    styles?: AuthScreenStyles;
    titles?: {
        loginTitle?: string;
        loginSubtitle?: string;
        signupTitle?: string;
        signupSubtitle?: string;
    };
    showPasswordHints?: boolean;
}
export declare const AuthScreen: ({ styles: userStyles, titles, showPasswordHints }: AuthScreenProps) => React.JSX.Element;
export {};
