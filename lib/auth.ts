// This file contains authentication-related types and mock functions.

export interface User {
  id: string;
  name: string;
  email: string;
  company: string;
  roles: string[];
}

export interface AuthState {
  token: string | null;
  refreshToken?: string | null;
  user: User | null;
  isLoading: boolean;
}

// Mock a login API call
export const mockLogin = async (email: string, company: string): Promise<{ token: string; refreshToken: string; user: User }> => {
  // CURSOR: API call to POST /api/v1/auth/login
  console.log(`Attempting login for ${email} at ${company}`);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockToken = `jwt-mock-token-${Date.now()}`;
      const mockRefresh = `jwt-mock-refresh-${Date.now()}`;
      const mockUser: User = {
        id: 'user-123',
        name: 'John Doe',
        email: email,
        company: company,
        roles: ['admin', 'finance_manager'],
      };
      resolve({ token: mockToken, refreshToken: mockRefresh, user: mockUser });
    }, 1000);
  });
};

// Mock a logout API call
export const mockLogout = async (): Promise<{ success: boolean }> => {
    // CURSOR: API call to POST /api/v1/auth/logout
    console.log('Attempting logout');
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ success: true });
        }, 500);
    });
};
