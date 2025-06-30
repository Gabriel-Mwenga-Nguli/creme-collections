
"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

// Mock user types for frontend-only mode
export type FirebaseUser = { uid: string; email: string; displayName: string; };
export type UserProfile = { name: string; email: string; };


interface AuthContextType {
  user: FirebaseUser | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<FirebaseUser>;
  register: (name: string, email: string, pass: string) => Promise<FirebaseUser>;
  googleLogin: () => Promise<FirebaseUser>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const MOCK_SESSION_KEY = 'creme-mock-session';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Simulate checking for a session
    const storedSession = localStorage.getItem(MOCK_SESSION_KEY);
    if (storedSession) {
        try {
            const sessionData = JSON.parse(storedSession);
            setUser(sessionData.user);
            setUserProfile(sessionData.userProfile);
        } catch (e) {
            localStorage.removeItem(MOCK_SESSION_KEY);
        }
    }
    setIsLoading(false);
  }, []);
  
  const handleAuthRedirect = useCallback((loggedInUser: FirebaseUser | null) => {
    if (loggedInUser) {
        if (pathname === '/login' || pathname === '/register') {
            router.push('/profile');
        }
    }
  },[pathname, router]);
  
  const createMockSession = (name: string, email: string) => {
      const uid = `mock_user_${email}`; // Use email to make mock UID consistent
      const mockUser = { uid, email, displayName: name };
      const mockProfile = { name, email };
      setUser(mockUser);
      setUserProfile(mockProfile);
      localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify({ user: mockUser, userProfile: mockProfile }));
      handleAuthRedirect(mockUser);
      return mockUser;
  };

  const login = useCallback(async (email: string, pass: string): Promise<FirebaseUser> => {
    await new Promise(res => setTimeout(res, 500));
    // In a real app, you would validate the password. Here, we just log in.
    if (!email || !pass) {
        throw new Error("Email and password are required.");
    }
    return createMockSession('Mock User', email);
  }, [handleAuthRedirect]);

  const register = useCallback(async (name: string, email: string, pass:string): Promise<FirebaseUser> => {
    await new Promise(res => setTimeout(res, 500));
    if (!name || !email || !pass) {
        throw new Error("All fields are required for registration.");
    }
    return createMockSession(name, email);
  }, [handleAuthRedirect]);
  
  const googleLogin = useCallback(async (): Promise<FirebaseUser> => {
    await new Promise(res => setTimeout(res, 500));
    return createMockSession('Google User', 'google.user@example.com');
  }, [handleAuthRedirect]);

  const logout = useCallback(async () => {
    setUser(null);
    setUserProfile(null);
    localStorage.removeItem(MOCK_SESSION_KEY);
    router.push('/');
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, userProfile, isLoading, login, register, googleLogin, logout }}>
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
