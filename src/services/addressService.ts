
'use server';

import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';

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
  try {
    const addressesRef = collection(db, "users", userId, "addresses");
    const q = query(addressesRef);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Address));
  } catch (error) {
    console.error("Error fetching user addresses:", error);
    return [];
  }
}

export async function addUserAddress(userId: string, addressData: Omit<Address, 'id' | 'userId'>): Promise<string | null> {
  try {
    const addressesRef = collection(db, "users", userId, "addresses");
    const docRef = await addDoc(addressesRef, addressData);
    return docRef.id;
  } catch (error) {
    console.error("Error adding user address:", error);
    return null;
  }
}

export async function updateUserAddress(userId: string, addressId: string, addressData: Partial<Omit<Address, 'id' | 'userId'>>): Promise<boolean> {
  try {
    const addressRef = doc(db, "users", userId, "addresses", addressId);
    await updateDoc(addressRef, addressData);
    return true;
  } catch (error) {
    console.error("Error updating user address:", error);
    return false;
  }
}

export async function deleteUserAddress(userId: string, addressId: string): Promise<boolean> {
  try {
    const addressRef = doc(db, "users", userId, "addresses", addressId);
    await deleteDoc(addressRef);
    return true;
  } catch (error) {
    console.error("Error deleting user address:", error);
    return false;
  }
}
