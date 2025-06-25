
'use server';

import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc, serverTimestamp, Timestamp } from 'firebase/firestore';

export interface UserProfile {
  name: string;
  email: string;
  createdAt: Date | Timestamp;
  // Add other profile fields as needed, e.g.,
  // phone?: string;
  // isAdmin?: boolean;
}

/**
 * Creates a user profile document in Firestore.
 * This is typically called right after a user signs up.
 * @param userId - The Firebase Auth user ID.
 * @param data - The user profile data.
 */
export async function createUserProfile(userId: string, data: Omit<UserProfile, 'createdAt'>): Promise<void> {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      ...data,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error creating user profile:", error);
    // Optionally re-throw or handle the error as needed
  }
}

/**
 * Retrieves a user's profile from Firestore.
 * @param userId - The Firebase Auth user ID.
 * @returns The user profile object or null if not found.
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const userRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    } else {
      console.log("No such user profile!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}
