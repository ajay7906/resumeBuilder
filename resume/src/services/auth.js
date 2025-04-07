import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const register = async (email, password) => {
  const response = await api.post('/auth/register', { email, password });
  return response.data;
};

export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const logout = async () => {
  await api.post('/auth/logout');
};

export const getProfile = async () => {
  const response = await api.get('/profile');
  return response.data.user;
};

export const refreshToken = async () => {
  const response = await api.post('/auth/refresh');
  return response.data;
};