import axios from "axios";
import { RegisterRequest, AuthResponse } from "@/types/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authApi = {
  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post('/v1/users/register', userData);
    return response.data;
  },
  
  login: async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
    const response = await api.post('/v1/auth/login', credentials);
    return response.data;
  },
};
