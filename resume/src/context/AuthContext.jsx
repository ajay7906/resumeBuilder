import { createContext, useContext, useEffect, useState } from 'react';
import { getProfile, login as apiLogin, logout as apiLogout, register as apiRegister, refreshToken } from '../services/auth';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const user = await getProfile();
        setUser(user);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          try {
            await refreshToken();
            const user = await getProfile();
            setUser(user);
          } catch (refreshError) {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const handleLogin = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const { user } = await apiLogin(email, password);
      setUser(user);
    } catch (err) {
      setError(axios.isAxiosError(err) ? err.response?.data?.error || 'Login failed' : 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const { user } = await apiRegister(email, password);
      setUser(user);
    } catch (err) {
      setError(axios.isAxiosError(err) ? err.response?.data?.error || 'Registration failed' : 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await apiLogout();
      setUser(null);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const value = {
    user,
    loading,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}