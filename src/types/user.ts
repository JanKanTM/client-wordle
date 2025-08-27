export interface User {
    id: number;
    username: string;
    password: string;
    score: number;
    isLoggedIn: boolean;
    isOnline: boolean;
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