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
      // DEVELOPMENT BYPASS: Auto-login if no token is found
      console.warn("No token found. Auto-bypassing for development.");
      const mockToken = 'dev-bypass-token';
      localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, mockToken);
      setUser({ name: 'Vraj', email: 'vraj@example.com' });
      setIsAuthenticated(true);
      setLoading(false);
      return;
    }

    // DEVELOPMENT BYPASS
    if (token === 'dev-bypass-token') {
      setUser({ name: 'Vraj', email: 'vraj@example.com' });
      setIsAuthenticated(true);
      setLoading(false);
      return;
    }

    try {
      const response = await authApi.getCurrentUser();
      const userData = response.data?.user || response.user || response;
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Failed to restore session');
      localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
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
    try {
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
    } catch (error) {
      console.warn("Backend unavailable. Bypassing authentication for development.");
      // DEVELOPMENT BYPASS
      const mockToken = "dev-bypass-token";
      const mockUser = { name: "Vraj", email: credentials?.email || "vraj@example.com" };
      localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, mockToken);
      setUser(mockUser);
      setIsAuthenticated(true);
      return { token: mockToken, user: mockUser };
    }
  };

  const register = async (payload) => {
    try {
      const response = await authApi.registerUser(payload);
      const token = response.data?.token || response.token;
      const userData = response.data?.user || response.user || response;
      
      if (token) {
        localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
        setUser(userData);
        setIsAuthenticated(true);
      }
      return response;
    } catch (error) {
      console.warn("Backend unavailable. Bypassing registration for development.");
      // DEVELOPMENT BYPASS
      const mockToken = "dev-bypass-token";
      const mockUser = { name: payload?.name || "Vraj", email: payload?.email || "vraj@example.com" };
      localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, mockToken);
      setUser(mockUser);
      setIsAuthenticated(true);
      return { token: mockToken, user: mockUser };
    }
  };
  
  const forgotPassword = async (email) => {
    try {
      return await authApi.forgotPassword(email);
    } catch (error) {
      // DEVELOPMENT BYPASS
      return { message: "Mock password reset sent." };
    }
  };

  const logout = () => {
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    forgotPassword
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
