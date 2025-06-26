
"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// This is a simplified User type for simulation, mirroring what Firebase might provide.
interface SimulatedUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

// This mirrors the UserProfile from your userService.
export interface UserProfile {
  name: string;
  email: string;
  createdAt: Date;
}

interface AuthContextType {
  user: SimulatedUser | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<SimulatedUser>;
  register: (name: string, email: string, pass: string) => Promise<SimulatedUser>;
  googleLogin: () => Promise<SimulatedUser>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_SESSION_KEY = 'creme-user-session';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<SimulatedUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  
  useEffect(() => {
    // Simulate checking for an existing session from localStorage
    try {
      const storedSession = localStorage.getItem(AUTH_SESSION_KEY);
      if (storedSession) {
        const sessionData = JSON.parse(storedSession);
        setUser(sessionData.user);
        setUserProfile(sessionData.userProfile);
      }
    } catch (error) {
      console.error("Could not parse user session from localStorage", error);
    }
    setIsLoading(false);
  }, []);
  
  const saveSession = (user: SimulatedUser, profile: UserProfile) => {
    localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify({ user, userProfile: profile }));
  }

  const login = useCallback(async (email: string, pass: string): Promise<SimulatedUser> => {
    console.log(`[Auth Sim] Logging in with ${email}`);
    await new Promise(res => setTimeout(res, 500)); // Simulate network delay
    
    // In a real app, you'd verify credentials. Here, we just create a user.
    const mockUser: SimulatedUser = { uid: `sim_${Date.now()}`, email, displayName: 'Simulated User' };
    const mockProfile: UserProfile = { name: 'Simulated User', email, createdAt: new Date() };

    setUser(mockUser);
    setUserProfile(mockProfile);
    saveSession(mockUser, mockProfile);
    router.push('/profile');
    return mockUser;
  }, [router]);
  
  const register = useCallback(async (name: string, email: string, pass: string): Promise<SimulatedUser> => {
    console.log(`[Auth Sim] Registering ${name} with ${email}`);
    await new Promise(res => setTimeout(res, 500));
    
    const mockUser: SimulatedUser = { uid: `sim_${Date.now()}`, email, displayName: name };
    const mockProfile: UserProfile = { name, email, createdAt: new Date() };
    
    setUser(mockUser);
    setUserProfile(mockProfile);
    saveSession(mockUser, mockProfile);
    router.push('/profile');
    return mockUser;
  }, [router]);
  
  const googleLogin = useCallback(async (): Promise<SimulatedUser> => {
    console.log(`[Auth Sim] Logging in with Google`);
    await new Promise(res => setTimeout(res, 500));
    
    const mockUser: SimulatedUser = { uid: `sim_google_${Date.now()}`, email: 'google.user@example.com', displayName: 'Google User' };
    const mockProfile: UserProfile = { name: 'Google User', email: 'google.user@example.com', createdAt: new Date() };
    
    setUser(mockUser);
    setUserProfile(mockProfile);
    saveSession(mockUser, mockProfile);
    router.push('/profile');
    return mockUser;
  }, [router]);

  const logout = useCallback(async () => {
    console.log(`[Auth Sim] Logging out`);
    localStorage.removeItem(AUTH_SESSION_KEY);
    setUser(null);
    setUserProfile(null);
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
