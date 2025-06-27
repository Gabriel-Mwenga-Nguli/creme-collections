
'use server';

import { Timestamp } from 'firebase/firestore';

export interface UserProfile {
  name: string;
  email: string;
  createdAt?: Date | Timestamp;
}

export async function createUserProfile(userId: string, data: Omit<UserProfile, 'createdAt'>): Promise<void> {
  console.log(`[Mock Service] Called createUserProfile for user ${userId}. Firestore is disabled.`);
  return Promise.resolve();
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  console.log(`[Mock Service] Called getUserProfile for user ${userId}. Firestore is disabled.`);
  return Promise.resolve({
      name: 'Mock User',
      email: 'mock.user@example.com'
  });
}
