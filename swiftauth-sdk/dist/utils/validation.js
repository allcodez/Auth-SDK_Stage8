"use strict";
// src/utils/validation.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePasswordSignup = exports.validatePasswordLogin = exports.validateEmail = void 0;
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email)
        return "Email is required.";
    if (!emailRegex.test(email))
        return "Please enter a valid email address.";
    return null;
};
exports.validateEmail = validateEmail;
const validatePasswordLogin = (password) => {
    if (!password)
        return "Password is required.";
    return null;
};
exports.validatePasswordLogin = validatePasswordLogin;
const validatePasswordSignup = (password) => {
    if (!password)
        return "Password is required.";
    if (password.length < 6)
        return "Password must be at least 6 characters.";
    if (!/\d/.test(password))
        return "Password must contain at least one number.";
    return null;
};
exports.validatePasswordSignup = validatePasswordSignup;
