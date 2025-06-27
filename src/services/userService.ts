
'use server';

import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc, Timestamp } from 'firebase/firestore';

export interface UserProfile {
  name: string;
  email: string;
  createdAt?: Date | Timestamp;
}

export async function createUserProfile(userId: string, data: Omit<UserProfile, 'createdAt'>): Promise<void> {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      ...data,
      createdAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error creating user profile: ", error);
  }
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const userRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting user profile: ", error);
    return null;
  }
}
