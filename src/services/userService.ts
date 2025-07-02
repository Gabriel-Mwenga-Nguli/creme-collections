
'use server';

import { Timestamp } from 'firebase/firestore';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  photoURL?: string;
  createdAt?: Date | Timestamp;
}

// Mocked Service Functions for Demo Mode

export async function createUserProfile(userId: string, data: { name: string, email: string, photoURL?: string }): Promise<void> {
    console.warn(`[Demo Mode] createUserProfile called for user ${userId}. No data will be saved to Firestore.`);
    console.log("Profile data:", data);
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  console.warn(`[Demo Mode] getUserProfile called for user ${userId}. Returning mock profile.`);
  // This will be called by AuthContext after login.
  // We return a mock profile to ensure the UI updates correctly.
  return {
    uid: userId,
    name: 'Demo User',
    email: 'demo@example.com',
    photoURL: '',
    createdAt: new Date(),
  };
}
