import React, { ReactNode } from 'react';
import { AuthConfig } from '../types';
interface AuthProviderProps {
    config: AuthConfig;
    children: ReactNode;
}
export declare const AuthProvider: React.FC<AuthProviderProps>;
export {};
