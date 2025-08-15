"use client";

import type React from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { usePermissions } from '@/hooks/use-permissions';

type ProtectedRouteProps = { children: React.ReactNode; required?: string };

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, required }) => {
  const { token, isLoading, isLoggingOut } = useAuth();
  const { hasPermission } = usePermissions();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !token && !isLoggingOut) {
      router.push('/login');
      return;
    }
    if (!isLoading && token && required && !hasPermission(required)) {
      router.push('/unauthorized');
    }
  }, [token, isLoading, isLoggingOut, required, hasPermission, router]);

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

  if (required && !hasPermission(required)) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
