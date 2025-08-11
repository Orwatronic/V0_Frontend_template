"use client";

import type React from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, isLoading, isLoggingOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !token && !isLoggingOut) {
      router.push('/login');
    }
  }, [token, isLoading, isLoggingOut, router]);

  if (isLoading || isLoggingOut || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Loading Application...</p>
          {/* You can add a spinner here */}
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
