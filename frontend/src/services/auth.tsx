import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export interface User {
  id: string;
  email: string;
}

export interface AuthResponse {
  user: User;
  accessToken?: string;
}

export const register = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await api.post('/auth/register', { email, password });
  return response.data;
};

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};

export const getProfile = async (): Promise<User> => {
  const response = await api.get('/profile');
  return response.data.user;
};

export const refreshToken = async (): Promise<{ accessToken: string }> => {
  const response = await api.post('/auth/refresh');
  return response.data;
};