import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  username: string;
  email: string;
  kycStatus?: string;
  balance?: number; // Added balance to user context for easy access
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (emailOrUsername: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUserContext: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('paymenu_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const fetchUserProfile = useCallback(async (currentToken: string) => {
    if (!currentToken) {
        setUser(null);
        return null; // Return null if no token
    }
    api.defaults.headers.common['Authorization'] = \`Bearer \${currentToken}\`;
    try {
      // Ensure backend profile endpoint returns all necessary user fields including kycStatus and balance
      const response = await api.get<{ data: User }>('/user/profile');
      setUser(response.data.data);
      return response.data.data; // Return fetched user
    } catch (error) {
      console.error('Failed to fetch user profile with token', error);
      localStorage.removeItem('paymenu_token');
      setToken(null);
      setUser(null);
      api.defaults.headers.common['Authorization'] = '';
      return null; // Return null on error
    }
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      const storedToken = localStorage.getItem('paymenu_token');
      if (storedToken) {
        setToken(storedToken);
        await fetchUserProfile(storedToken);
      }
      setIsLoading(false);
    };
    initializeAuth();
  }, [fetchUserProfile]);

  const refreshUserContext = useCallback(async () => {
    const currentToken = localStorage.getItem('paymenu_token');
    if (currentToken) {
        setIsLoading(true);
        await fetchUserProfile(currentToken);
        setIsLoading(false);
    }
  }, [fetchUserProfile]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await api.post<{ token: string; user: User }>('/auth/login', { email, password });
      setToken(response.data.token);
      setUser(response.data.user);
      localStorage.setItem('paymenu_token', response.data.token);
      api.defaults.headers.common['Authorization'] = \`Bearer \${response.data.token}\`;
      setIsLoading(false);
      navigate(response.data.user.kycStatus === 'verified' ? '/dashboard' : '/kyc');
    } catch (error) {
      setIsLoading(false);
      console.error('Login failed in AuthContext:', error);
      // @ts-ignore
      // No alert here, just throw so the component can handle it
      throw error;
    }
  };

  const signup = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await api.post<{ token: string; user: User }>('/auth/signup', { username, email, password });
      setToken(response.data.token);
      setUser(response.data.user);
      localStorage.setItem('paymenu_token', response.data.token);
      api.defaults.headers.common['Authorization'] = \`Bearer \${response.data.token}\`;
      setIsLoading(false);
      navigate('/kyc');
    } catch (error) {
      setIsLoading(false);
      console.error('Signup failed in AuthContext:', error);
      // @ts-ignore
      // No alert here, just throw
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('paymenu_token');
    api.defaults.headers.common['Authorization'] = '';
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, signup, logout, refreshUserContext }}>
      {children}
      {/* Removed !isLoading condition here, pages should handle their own loading states based on context.
          App-wide initial loader in Layout.tsx is better. */}
    </AuthContext.Provider>
  );
};
