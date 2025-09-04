import api from "axios";
import type { AxiosResponse } from "axios";
import { API_URL } from "../config/api.config";

export interface User {
  _id: string;
  username: string;
  score: number;
  role: string;
  isValid: boolean;
  createdAt: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  error?: string;
  errorCode?: number;
  data: {
    user: User;
    token: string;
  }
}

export interface UserResponse {
  success: boolean;
  error?: string;
  errorCode?: string;
  data: User;
}

/**
 * Login user
 * POST /login
 **/
export function loginUser(credentials: LoginRequest): Promise<{user: User; token: string}> {
  return api.post<AuthResponse>(`${API_URL}/login`, credentials)
    .then((response: AxiosResponse<AuthResponse>) => response.data.data)
}

/**
 * Register user
 * POST /register
 **/
export function registerUser(credentials: RegisterRequest): Promise<{ user: User; token: string }> {
  return api.post<AuthResponse>(`${API_URL}/register`, credentials)
    .then((response: AxiosResponse<AuthResponse>) => response.data.data)
}

/**
 * Get current user
 * GET /profile
 **/
export function getCurrentUser(): Promise<User> {
  return api.get<UserResponse>(`${API_URL}/profile`)
    .then((response: AxiosResponse<UserResponse>) => response.data.data)
}

/**
 * Logout user (client-side)
 **/
export function logoutUser(): void {
  sessionStorage.removeItem('auth_token')
}