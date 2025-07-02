
"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { auth, db, storage, isConfigured } from '@/lib/firebase';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile as updateFirebaseProfile,
  type User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { useToast } from '@/hooks/use-toast';
import { getUserProfile as fetchUserProfileService, createUserProfile } from '@/services/userService';

export type UserProfile = {
  uid: string;
  name: string;
  email: string;
  photoURL: string | null;
  createdAt?: any;
};

interface AuthContextType {
  user: FirebaseUser | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<FirebaseUser>;
  register: (name: string, email: string, pass: string) => Promise<FirebaseUser>;
  googleLogin: () => Promise<FirebaseUser>;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile> & { newPhotoDataUrl?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  const handleAuthRedirect = useCallback((loggedInUser: FirebaseUser | null) => {
    if (loggedInUser) {
        if (pathname === '/login' || pathname === '/register') {
            router.push('/profile');
        }
    }
  },[pathname, router]);

  useEffect(() => {
    if (!isConfigured || !auth) {
        setIsLoading(false);
        return;
    }
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const profile = await fetchUserProfileService(firebaseUser.uid);
        setUserProfile(profile);
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = useCallback(async (email: string, pass: string): Promise<FirebaseUser> => {
    if (!isConfigured || !auth) throw new Error("Firebase is not configured. Cannot log in.");
    const userCredential = await signInWithEmailAndPassword(auth, email, pass);
    handleAuthRedirect(userCredential.user);
    return userCredential.user;
  }, [handleAuthRedirect]);

  const register = useCallback(async (name: string, email: string, pass: string): Promise<FirebaseUser> => {
    if (!isConfigured || !auth) throw new Error("Firebase is not configured. Cannot register.");
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const { user: firebaseUser } = userCredential;
    
    await updateFirebaseProfile(firebaseUser, { displayName: name });
    
    // Create profile locally and in the service (which is now mocked)
    const profileData = { uid: firebaseUser.uid, name, email: firebaseUser.email || '', photoURL: firebaseUser.photoURL || null };
    await createUserProfile(firebaseUser.uid, profileData);
    
    setUser(firebaseUser);
    setUserProfile(profileData);
    handleAuthRedirect(firebaseUser);
    return firebaseUser;
  }, [handleAuthRedirect]);
  
  const googleLogin = useCallback(async (): Promise<FirebaseUser> => {
    if (!isConfigured || !auth) throw new Error("Firebase is not configured. Cannot use Google login.");
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const { user: firebaseUser } = result;

    const existingProfile = await fetchUserProfileService(firebaseUser.uid);
    if (!existingProfile) {
        await createUserProfile(firebaseUser.uid, {
            name: firebaseUser.displayName || 'New User',
            email: firebaseUser.email || '',
            photoURL: firebaseUser.photoURL || undefined
        });
    }

    handleAuthRedirect(firebaseUser);
    return firebaseUser;
  }, [handleAuthRedirect]);

  const logout = useCallback(async () => {
    if (!isConfigured || !auth) return;
    await signOut(auth);
    router.push('/');
  }, [router]);

  const updateUserProfile = useCallback(async (data: Partial<UserProfile> & { newPhotoDataUrl?: string }) => {
    if (!user) {
        toast({ title: 'You must be logged in to update your profile.', variant: 'destructive' });
        return;
    }

    const { newPhotoDataUrl, ...profileData } = data;
    let photoURL = userProfile?.photoURL;
    
    // Mock upload if running in demo mode without storage
    if (newPhotoDataUrl && !storage) {
        console.warn("[Demo Mode] Profile picture update skipped. Storage not configured.");
        photoURL = newPhotoDataUrl; // Show locally for demo effect
    } else if (newPhotoDataUrl && storage) {
      const storageRef = ref(storage, `profile_pictures/${user.uid}`);
      try {
        await uploadString(storageRef, newPhotoDataUrl, 'data_url');
        photoURL = await getDownloadURL(storageRef);
      } catch (error) {
        console.error("Error uploading profile picture: ", error);
        toast({ title: 'Image Upload Failed', description: 'Could not upload your new picture.', variant: 'destructive'});
        return;
      }
    }

    const finalProfileData = { ...profileData, photoURL: photoURL !== undefined ? photoURL : userProfile?.photoURL };

    await updateFirebaseProfile(user, {
      displayName: finalProfileData.name,
      photoURL: finalProfileData.photoURL,
    });
    
    if (db) {
        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, finalProfileData);
    } else {
        console.warn("[Demo Mode] Firestore is not configured. Profile update is not saved.");
    }

    setUserProfile(prev => prev ? { ...prev, ...finalProfileData } : null);
    
    if (data.name !== userProfile?.name) {
       toast({ title: 'Profile Updated!', description: 'Your personal details have been saved.' });
    }

  }, [user, userProfile, toast]);

  return (
    <AuthContext.Provider value={{ user, userProfile, isLoading, login, register, googleLogin, logout, updateUserProfile }}>
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
