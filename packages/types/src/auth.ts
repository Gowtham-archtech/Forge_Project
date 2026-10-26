/**
 * FORGE Shared Contract: Authentication
 */

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
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
