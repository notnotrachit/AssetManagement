'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser } from '@/lib/auth';
import { User } from '@/lib/types';
import Cookies from 'js-cookie';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authLogin: (token: string) => Promise<void>;
  authLogout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
        Cookies.set('token', storedToken, { expires: 1 }); // Ensure cookie is set
        try {
          const userData = await getCurrentUser(storedToken);
          setUser(userData);
        } catch (error) {
          console.error('Failed to get user:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          Cookies.remove('token');
          Cookies.remove('refreshToken');
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    init();
  }, []);

  const authLogin = async (newToken: string) => {
    try {
      localStorage.setItem('token', newToken);
      setToken(newToken);
      const userData = await getCurrentUser(newToken);
      setUser(userData);
    } catch (error) {
      console.error('Error setting up auth:', error);
      throw error;
    }
  };

  const authLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    Cookies.remove('token');
    Cookies.remove('refreshToken');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        authLogin,
        authLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
