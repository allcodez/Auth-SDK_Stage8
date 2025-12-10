// src/utils/validation.ts

export const validateEmail = (email: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return "Email is required.";
  if (!emailRegex.test(email)) return "Please enter a valid email address.";
  return null;
};

export const validatePasswordLogin = (password: string): string | null => {
  if (!password) return "Password is required.";
  return null;
};

export const validatePasswordSignup = (password: string): string | null => {
  if (!password) return "Password is required.";
  if (password.length < 6) return "Password must be at least 6 characters.";
  if (!/\d/.test(password)) return "Password must contain at least one number.";
  return null;
};