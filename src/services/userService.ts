
'use server';

import { db, isConfigured } from '@/lib/firebase';
import { doc, setDoc, getDoc, Timestamp, serverTimestamp } from 'firebase/firestore';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  photoURL?: string;
  createdAt?: Date | Timestamp;
}

export async function createUserProfile(userId: string, data: { name: string, email: string, photoURL?: string }): Promise<void> {
    if (!isConfigured || !db) {
        console.warn("[Demo Mode] createUserProfile called. No data will be saved.");
        return;
    }
  const userRef = doc(db, 'users', userId);
  await setDoc(userRef, {
    uid: userId,
    name: data.name,
    email: data.email,
    photoURL: data.photoURL || null,
    createdAt: serverTimestamp(),
  }, { merge: true });
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
    if (!isConfigured || !db) {
        console.warn("[Demo Mode] getUserProfile called. Returning null.");
        return null;
    }
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
