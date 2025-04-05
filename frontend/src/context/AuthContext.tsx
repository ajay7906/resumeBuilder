import { createContext, useContext, useEffect, useState } from 'react';
import { User, getProfile, login, logout as apiLogout, register, refreshToken } from '../services/auth';
import axios from 'axios';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const user = await getProfile();
        setUser(user);
      } catch (err) {
        // Try to refresh token if 401
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

  const handleLogin = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const { user } = await login(email, password);
      setUser(user);
    } catch (err) {
      setError(axios.isAxiosError(err) ? err.response?.data?.error || 'Login failed' : 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const { user } = await register(email, password);
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