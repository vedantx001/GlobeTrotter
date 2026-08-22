import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { AUTH_TOKEN_STORAGE_KEY } from '../utils/constants';
import * as authApi from '../api/auth_api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const initAuth = useCallback(async () => {
    const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
    if (!token) {
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    try {
      const response = await authApi.getCurrentUser();
      const userData = response.data?.user || response.user || response;
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Failed to restore session:', error);
      localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
      localStorage.removeItem('mock_user_data');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  const login = async (credentials) => {
    const response = await authApi.loginUser(credentials);
    const token = response.data?.token || response.token;
    const userData = response.data?.user || response.user || response;
    
    if (token) {
      localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
      setUser(userData);
      setIsAuthenticated(true);
      return response;
    } else {
      throw new Error('No token received');
    }
  };

  const register = async (payload) => {
    const response = await authApi.registerUser(payload);
    const token = response.data?.token || response.token;
    const userData = response.data?.user || response.user || response;
    
    if (token) {
      localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
      setUser(userData);
      setIsAuthenticated(true);
    }
    return response;
  };
  
  const forgotPassword = async (email) => {
    return await authApi.forgotPassword(email);
  };

  const logout = () => {
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    localStorage.removeItem('mock_user_data');
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (userData) => {
    setUser((prev) => ({ ...prev, ...userData }));
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    forgotPassword,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
