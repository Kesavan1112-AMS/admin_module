import { jwtDecode } from "jwt-decode";

export const validateEmail = (email: string): string => {
  if (!email.trim()) {
    return `Email cannot be empty`;
  }
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) {
    return "Please enter a valid email address.";
  } else {
    return "";
  }
};

export const validatePassword = (password: string): string => {
  if (!password.trim()) {
    return `Password cannot be empty`;
  }

  const minLengthRegex = /.{8,}/;
  const hasUpperCaseRegex = /.*[A-Z].*/;
  const hasNumberRegex = /.*\d.*/;
  const hasSpecialCharRegex = /.*[!@#$%^&*(),.?":{}|<>].*/;

  if (!hasUpperCaseRegex.test(password)) {
    return "Need at least one uppercase letter";
  }
  if (!hasNumberRegex.test(password)) {
    return "Need at least one number";
  }
  if (!hasSpecialCharRegex.test(password)) {
    return "Need at least one special character";
  }
  if (!minLengthRegex.test(password)) {
    return "Password must be at least 8 characters long";
  }

  return "";
};

export const jwtVerification = (token: string): boolean => {
  const decoded: any = jwtDecode(token);

  const currentTime = Date.now() / 1000;

  if (decoded.exp && decoded.exp < currentTime) {
    return false;
  }

  return true;
};
