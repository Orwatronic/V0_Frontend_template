"use client";

import type React from 'react';
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@/lib/auth';
import { mockLogin, mockLogout } from '@/lib/auth';
import { apiLogin, apiLogout } from '@/lib/auth-api';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  company: string | null;
  token: string | null;
  refreshToken: string | null;
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
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('erp-token');
      const storedRefresh = localStorage.getItem('erp-refresh-token');
      const userString = localStorage.getItem('erp-user');
      const storedCompany = localStorage.getItem('erp-company');
      if (storedToken && userString && storedCompany) {
        setUser(JSON.parse(userString));
        setToken(storedToken);
        if (storedRefresh) setRefreshToken(storedRefresh);
        setCompany(storedCompany);
      }
    } catch (error) {
      console.error("Failed to parse auth data from localStorage", error);
      // Clear corrupted data
      localStorage.removeItem('erp-token');
      localStorage.removeItem('erp-refresh-token');
      localStorage.removeItem('erp-user');
      localStorage.removeItem('erp-company');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, company: string) => {
    setIsLoading(true);
    try {
      // Decide mock vs real based on local flag (feebee:auth:mock). Defaults to true when absent.
      let useMock = true;
      try {
        const v = localStorage.getItem('feebee:auth:mock');
        useMock = v ? v === '1' : true;
      } catch {}

      // CURSOR: API call to POST /api/v1/auth/login
      const { token: apiToken, refreshToken: apiRefresh, user: apiUser } = useMock
        ? await mockLogin(email, company)
        : await (async () => {
            const res = await apiLogin(email, company);
            return { token: res.accessToken, refreshToken: res.refreshToken || null, user: res.user as User };
          })();
      localStorage.setItem('erp-token', apiToken);
      if (apiRefresh) localStorage.setItem('erp-refresh-token', apiRefresh);
      localStorage.setItem('erp-user', JSON.stringify(apiUser));
      localStorage.setItem('erp-company', company);
      setToken(apiToken);
      setRefreshToken(apiRefresh || null);
      setUser(apiUser);
      setCompany(company);
      router.push('/dashboard');
    } catch (error) {
      console.error("Login failed", error);
      toast({ title: 'Login failed', description: (error as any)?.message || 'Please try again', variant: 'destructive' });
      setToken(null);
      setRefreshToken(null);
      setUser(null);
      setCompany(null);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const logout = useCallback(async () => {
    setIsLoggingOut(true);
    // CURSOR: API call to POST /api/v1/auth/logout
    try {
      let useMock = true;
      try {
        const v = localStorage.getItem('feebee:auth:mock');
        useMock = v ? v === '1' : true;
      } catch {}
      if (useMock) {
        await mockLogout();
      } else {
        await apiLogout();
      }
    } catch (e) {
      console.warn('Logout error ignored', e);
    }
    localStorage.removeItem('erp-token');
    localStorage.removeItem('erp-user');
    localStorage.removeItem('erp-company');
    localStorage.removeItem('erp-refresh-token');
    setToken(null);
    setRefreshToken(null);
    setUser(null);
    setCompany(null);
    router.push('/');
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, company, token, refreshToken, isLoading, isLoggingOut, login, logout }}>
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
