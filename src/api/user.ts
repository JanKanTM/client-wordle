import axios from "axios";
import type { RegisterRequest, LoginRequest } from "../types/user.ts";

const API_URL = "http://localhost:8080/api";

/* Register user */
export async function registerUser(credentials: RegisterRequest) {
  try {
    const response = await axios.post(`${API_URL}/register`, credentials);
    return response.data; 
  } catch (error) {
    throw new Error("Registrierung fehlgeschlagen");
  }
}

/* Login user */
export async function loginUser(credentials: LoginRequest) {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data; 
  } catch (error) {
    throw new Error("Login fehlgeschlagen");
  }
}