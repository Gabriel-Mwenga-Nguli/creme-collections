
'use server';

import type { Timestamp } from 'firebase/firestore';

export interface UserProfile {
  name: string;
  email: string;
  createdAt: Date | Timestamp;
}

export async function createUserProfile(userId: string, data: Omit<UserProfile, 'createdAt'>): Promise<void> {
    console.log(`[Mock Service] Creating profile for user ${userId} with data:`, data);
    // In simulation, we don't need to do anything here.
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  console.log(`[Mock Service] Getting profile for user ${userId}.`);
  // This service will likely not be called directly in simulation mode, 
  // as the simulated AuthContext will hold the profile info.
  // Returning a default mock for completeness.
  return {
      name: "Mock User",
      email: "mock.user@example.com",
      createdAt: new Date()
  };
}
