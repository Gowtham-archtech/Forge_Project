/**
 * FORGE Shared Contract: Authentication & Account Lifecycle
 */

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  isEmailVerified: boolean;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  displayName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: UserProfile;
  message?: string;
}

export interface SessionStatusResponse {
  authenticated: boolean;
  user: UserProfile | null;
}

export interface VerifyEmailRequest {
  token: string; // or 6-digit OTP code depending on Codex's choice
}

export interface RequestPasswordResetRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export type AuthErrorCode =
  | 'INVALID_CREDENTIALS'
  | 'EMAIL_ALREADY_IN_USE'
  | 'EMAIL_UNVERIFIED'
  | 'RATE_LIMITED'
  | 'SESSION_EXPIRED'
  | 'INVALID_TOKEN'
  | 'PASSWORD_TOO_WEAK';

export interface AuthErrorResponse {
  code: AuthErrorCode;
  message: string;
  retryAfterSeconds?: number;
}
