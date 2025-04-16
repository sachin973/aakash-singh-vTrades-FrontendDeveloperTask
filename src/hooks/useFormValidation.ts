import { useState } from "react";

interface Errors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
}

export const useFormValidation = () => {
  const [errors, setErrors] = useState<Errors>({});

  const validateEmail = (email: string, checkExists?: (email: string) => boolean): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return setError("email", "Email is required");
    if (!regex.test(email)) return setError("email", "Invalid email format");
    if (checkExists?.(email)) return setError("email", "Email already exists");
    clearError("email");
    return true;
  };

  const validatePassword = (password: string): boolean => {
    if (!password) return setError("password", "Password is required");
    if (password.length < 8) return setError("password", "Min 8 characters");
    if (!/[A-Z]/.test(password)) return setError("password", "At least one uppercase");
    if (!/[0-9]/.test(password)) return setError("password", "At least one number");
    clearError("password");
    return true;
  };

  const validateConfirmPassword = (confirm: string, password: string): boolean => {
    if (!confirm) return setError("confirmPassword", "Please confirm your password");
    if (confirm !== password) return setError("confirmPassword", "Passwords do not match");
    clearError("confirmPassword");
    return true;
  };

  const validateTerms = (agreed: boolean): boolean => {
    if (!agreed) return setError("terms", "You must agree to continue");
    clearError("terms");
    return true;
  };

  const setError = (field: keyof Errors, message: string): boolean => {
    setErrors((prev) => ({ ...prev, [field]: message }));
    return false;
  };

  const clearError = (field: keyof Errors): void => {
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  return {
    errors,
    setError,
    clearError,
    validateEmail,
    validatePassword,
    validateConfirmPassword,
    validateTerms,
  };
};
