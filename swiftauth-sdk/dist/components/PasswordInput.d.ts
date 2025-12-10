import React from 'react';
import { TextInputProps } from 'react-native';
import { AuthScreenStyles } from '../types';
interface PasswordInputProps extends TextInputProps {
    styles?: AuthScreenStyles;
}
export declare const PasswordInput: ({ styles, ...props }: PasswordInputProps) => React.JSX.Element;
export {};
