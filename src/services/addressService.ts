
'use server';

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
  console.log(`[Mock Service] Called getUserAddresses for user ${userId}. Firestore is disabled.`);
  return [];
}

export async function addUserAddress(userId: string, addressData: Omit<Address, 'id' | 'userId'>): Promise<string | null> {
  console.log(`[Mock Service] Called addUserAddress for user ${userId}. Firestore is disabled.`);
  return `mock_address_${Date.now()}`;
}

export async function updateUserAddress(userId: string, addressId: string, addressData: Partial<Omit<Address, 'id' | 'userId'>>): Promise<boolean> {
  console.log(`[Mock Service] Called updateUserAddress for user ${userId}. Firestore is disabled.`);
  return true;
}

export async function deleteUserAddress(userId: string, addressId: string): Promise<boolean> {
  console.log(`[Mock Service] Called deleteUserAddress for user ${userId}. Firestore is disabled.`);
  return true;
}
