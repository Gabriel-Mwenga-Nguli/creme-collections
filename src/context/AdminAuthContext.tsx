
"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AdminUser {
  name: string;
  email: string;
}

interface AdminAuthContextType {
  user: AdminUser | null;
  isAdmin: boolean;
  isLoading: boolean;
  login: (user: AdminUser) => void;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const ADMIN_SESSION_KEY = 'creme-admin-session';

export const AdminAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedSession = localStorage.getItem(ADMIN_SESSION_KEY);
      if (storedSession) {
        setUser(JSON.parse(storedSession));
      }
    } catch (error) {
      console.error("Could not parse admin session from localStorage", error);
    }
    setIsLoading(false);
  }, []);


  const login = useCallback((adminUser: AdminUser) => {
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(adminUser));
    setUser(adminUser);
    router.push('/admin/dashboard');
  }, [router]);

  const logout = useCallback(() => {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    setUser(null);
    router.push('/admin/login');
  }, [router]);

  const isAdmin = !!user;

  return (
    <AdminAuthContext.Provider value={{ user, isAdmin, isLoading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = (): AdminAuthContextType => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
