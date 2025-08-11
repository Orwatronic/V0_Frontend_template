"use client";

import type React from 'react';
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@/lib/auth';
import { mockLogin, mockLogout } from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  company: string | null;
  token: string | null;
  isLoading: boolean;
  isLoggingOut: boolean;
  login: (email: string, company: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [company, setCompany] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('erp-token');
      const userString = localStorage.getItem('erp-user');
      const storedCompany = localStorage.getItem('erp-company');
      if (storedToken && userString && storedCompany) {
        setUser(JSON.parse(userString));
        setToken(storedToken);
        setCompany(storedCompany);
      }
    } catch (error) {
      console.error("Failed to parse auth data from localStorage", error);
      // Clear corrupted data
      localStorage.removeItem('erp-token');
      localStorage.removeItem('erp-user');
      localStorage.removeItem('erp-company');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, company: string) => {
    setIsLoading(true);
    try {
      // CURSOR: API call to POST /api/v1/auth/login
      const { token: apiToken, user: apiUser } = await mockLogin(email, company);
      localStorage.setItem('erp-token', apiToken);
      localStorage.setItem('erp-user', JSON.stringify(apiUser));
      localStorage.setItem('erp-company', company);
      setToken(apiToken);
      setUser(apiUser);
      setCompany(company);
      router.push('/dashboard');
    } catch (error) {
      console.error("Login failed", error);
      setToken(null);
      setUser(null);
      setCompany(null);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const logout = useCallback(async () => {
    setIsLoggingOut(true);
    // CURSOR: API call to POST /api/v1/auth/logout
    await mockLogout();
    localStorage.removeItem('erp-token');
    localStorage.removeItem('erp-user');
    localStorage.removeItem('erp-company');
    setToken(null);
    setUser(null);
    setCompany(null);
    router.push('/');
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, company, token, isLoading, isLoggingOut, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
