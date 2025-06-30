
"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { auth, db, storage } from '@/lib/firebase';
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

  const fetchUserProfile = useCallback(async (firebaseUser: FirebaseUser): Promise<UserProfile | null> => {
    const userDocRef = doc(db, 'users', firebaseUser.uid);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
    return null;
  }, []);

  const handleAuthRedirect = useCallback((loggedInUser: FirebaseUser | null) => {
    if (loggedInUser) {
        if (pathname === '/login' || pathname === '/register') {
            router.push('/profile');
        }
    }
  },[pathname, router]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const profile = await fetchUserProfile(firebaseUser);
        setUserProfile(profile);
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [fetchUserProfile]);

  const login = useCallback(async (email: string, pass: string): Promise<FirebaseUser> => {
    const userCredential = await signInWithEmailAndPassword(auth, email, pass);
    handleAuthRedirect(userCredential.user);
    return userCredential.user;
  }, [handleAuthRedirect]);

  const register = useCallback(async (name: string, email: string, pass: string): Promise<FirebaseUser> => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const { user: firebaseUser } = userCredential;
    
    await updateFirebaseProfile(firebaseUser, { displayName: name });
    
    const profileData = {
      uid: firebaseUser.uid,
      name,
      email,
      photoURL: firebaseUser.photoURL || null
    };
    
    await setDoc(doc(db, "users", firebaseUser.uid), { ...profileData, createdAt: serverTimestamp() });
    
    setUser(firebaseUser);
    setUserProfile(profileData);
    handleAuthRedirect(firebaseUser);
    return firebaseUser;
  }, [handleAuthRedirect]);
  
  const googleLogin = useCallback(async (): Promise<FirebaseUser> => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const { user: firebaseUser } = result;

    const userDocRef = doc(db, 'users', firebaseUser.uid);
    const docSnap = await getDoc(userDocRef);

    if (!docSnap.exists()) {
      await setDoc(userDocRef, {
        uid: firebaseUser.uid,
        name: firebaseUser.displayName,
        email: firebaseUser.email,
        photoURL: firebaseUser.photoURL,
        createdAt: serverTimestamp()
      });
    }

    handleAuthRedirect(firebaseUser);
    return firebaseUser;
  }, [handleAuthRedirect]);

  const logout = useCallback(async () => {
    await signOut(auth);
    router.push('/');
  }, [router]);

  const updateUserProfile = useCallback(async (data: Partial<UserProfile> & { newPhotoDataUrl?: string }) => {
    if (!user) {
        toast({ title: 'You must be logged in.', variant: 'destructive' });
        return;
    }

    const { newPhotoDataUrl, ...profileData } = data;
    let photoURL = userProfile?.photoURL;
    
    if (newPhotoDataUrl) {
      const storageRef = ref(storage, `profile_pictures/${user.uid}`);
      try {
        await uploadString(storageRef, newPhotoDataUrl, 'data_url');
        photoURL = await getDownloadURL(storageRef);
      } catch (error) {
        console.error("Error uploading profile picture: ", error);
        toast({ title: 'Image Upload Failed', description: 'Could not upload your new picture.', variant: 'destructive'});
        return; // Exit if upload fails
      }
    }

    const finalProfileData = { ...profileData, photoURL: photoURL !== undefined ? photoURL : userProfile?.photoURL };

    // Update Firebase Auth profile
    await updateFirebaseProfile(user, {
      displayName: finalProfileData.name,
      photoURL: finalProfileData.photoURL,
    });
    
    // Update Firestore profile
    const userDocRef = doc(db, 'users', user.uid);
    await updateDoc(userDocRef, finalProfileData);

    // Update local state
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
