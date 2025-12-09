import React from 'react';
import { AuthContextType } from '../types';

// Create the context with a default undefined value
// We force the type here to avoid checking for 'undefined' everywhere in the app
export const AuthContext = React.createContext<AuthContextType | undefined>(undefined);