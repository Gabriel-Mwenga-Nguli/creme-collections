
'use server';

import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc, Timestamp, serverTimestamp } from 'firebase/firestore';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  photoURL?: string;
  createdAt?: Date | Timestamp;
  // Add other profile fields as needed
}

export async function createUserProfile(userId: string, data: { name: string, email: string, photoURL?: string }): Promise<void> {
  const userRef = doc(db, 'users', userId);
  await setDoc(userRef, {
    uid: userId,
    name: data.name,
    email: data.email,
    photoURL: data.photoURL || null,
    createdAt: serverTimestamp(),
  }, { merge: true }); // Use merge to avoid overwriting existing fields if user logs in via different methods
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const userRef = doc(db, 'users', userId);
  const docSnap = await getDoc(userRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
        uid: data.uid,
        name: data.name,
        email: data.email,
        photoURL: data.photoURL,
        createdAt: data.createdAt,
    } as UserProfile;
  } else {
    return null;
  }
}
