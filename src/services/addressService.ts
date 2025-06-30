
'use server';

import { db, isConfigured } from '@/lib/firebase';

export interface Address {
  id: string;
  userId: string;
  name: string;
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault?: boolean;
}

export async function getUserAddresses(userId: string): Promise<Address[]> {
    if (!isConfigured || !db) {
        console.warn("[Demo Mode] getUserAddresses called. Returning empty array.");
        return [];
    }
  console.log(`Firestore is enabled. Would fetch addresses for user ${userId}.`);
  return [];
}

export async function addUserAddress(userId: string, addressData: Omit<Address, 'id' | 'userId'>): Promise<string | null> {
    if (!isConfigured || !db) {
        console.warn("[Demo Mode] addUserAddress called. No data will be saved.");
        return `mock_address_${Date.now()}`;
    }
  console.log(`Firestore is enabled. Would add address for user ${userId}.`);
  return `mock_address_${Date.now()}`;
}

export async function updateUserAddress(userId: string, addressId: string, addressData: Partial<Omit<Address, 'id' | 'userId'>>): Promise<boolean> {
    if (!isConfigured || !db) {
        console.warn(`[Demo Mode] updateUserAddress for ${addressId} ignored.`);
        return true;
    }
  console.log(`Firestore is enabled. Would update address for user ${userId}.`);
  return true;
}

export async function deleteUserAddress(userId: string, addressId: string): Promise<boolean> {
    if (!isConfigured || !db) {
        console.warn(`[Demo Mode] deleteUserAddress for ${addressId} ignored.`);
        return true;
    }
  console.log(`Firestore is enabled. Would delete address for user ${userId}.`);
  return true;
}
