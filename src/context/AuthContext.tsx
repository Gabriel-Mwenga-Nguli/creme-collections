
"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  type User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { createUserProfile, getUserProfile, type UserProfile } from '@/services/userService';

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

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const profile = await getUserProfile(user.uid);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = useCallback(async (email: string, pass: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, pass);
    router.push('/profile');
    return userCredential.user;
  }, [router]);
  
  const googleLogin = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    // Check if user profile exists, if not, create one
    const profile = await getUserProfile(user.uid);
    if (!profile) {
      await createUserProfile(user.uid, {
        name: user.displayName || 'New User',
        email: user.email!,
        createdAt: new Date(),
      });
    }
    
    router.push('/profile');
    return user;
  }, [router]);

  const register = useCallback(async (name: string, email: string, pass: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const user = userCredential.user;
    // Create user profile in Firestore
    await createUserProfile(user.uid, {
      name: name,
      email: user.email!,
      createdAt: new Date(),
    });
    router.push('/profile');
    return user;
  }, [router]);


  const logout = useCallback(async () => {
    await signOut(auth);
    router.push('/');
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, userProfile, isLoading, login, register, googleLogin, logout }}>
      {!isLoading && children}
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
