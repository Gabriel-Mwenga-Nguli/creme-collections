"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  name: string;
  email: string;
  // Add other user properties if needed
}

interface AuthContextType {
  user: User | null;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUser: User = {
  name: 'Jane Doe',
  email: 'jane.doe@example.com',
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const login = useCallback(() => {
    setUser(mockUser);
    router.push('/profile');
  }, [router]);

  const logout = useCallback(() => {
    setUser(null);
    router.push('/');
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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
