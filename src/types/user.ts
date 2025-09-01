export interface User {
  id: number;
  username: string;
  score: number;
  isLoggedIn: boolean;
  isValid: boolean;
}

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}