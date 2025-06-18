
'use server';

import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, where, orderBy, doc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';

export interface Address {
  id: string; // Firestore document ID
  userId: string; // To ensure we only fetch addresses for the logged-in user
  name: string; // e.g., "Home", "Work"
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postalCode: string;
  country: string; // Default to 'Kenya'
  phone: string;
  isDefault?: boolean;
}

// Helper function to map Firestore doc to our Address interface
function mapDocToAddress(document: FirebaseFirestore.QueryDocumentSnapshot | FirebaseFirestore.DocumentSnapshot): Address {
  const data = document.data();
  if (!data) {
    throw new Error(`Address data is undefined for document ID: ${document.id}`);
  }
  return {
    id: document.id,
    userId: data.userId,
    name: data.name || 'Address',
    firstName: data.firstName || '',
    lastName: data.lastName || '',
    addressLine1: data.addressLine1 || '',
    addressLine2: data.addressLine2,
    city: data.city || '',
    postalCode: data.postalCode || '',
    country: data.country || 'Kenya',
    phone: data.phone || '',
    isDefault: typeof data.isDefault === 'boolean' ? data.isDefault : false,
  };
}

export async function getUserAddresses(userId: string): Promise<Address[]> {
  if (!db) {
    console.error("Firestore 'db' object is not initialized. Cannot fetch user addresses.");
    return [];
  }
  if (!userId) {
    console.error("User ID is required to fetch addresses.");
    return [];
  }

  try {
    const addressesRef = collection(db, 'users', userId, 'addresses');
    // Optionally order by isDefault then by name, or by when they were added
    const q = query(addressesRef, orderBy('isDefault', 'desc'), orderBy('name', 'asc'));
    const querySnapshot = await getDocs(q);
    
    const addresses = querySnapshot.docs.map(docSnapshot => mapDocToAddress(docSnapshot));
    return addresses;
  } catch (error) {
    console.error(`Error fetching addresses for user ${userId}: `, error);
    return [];
  }
}

export async function addUserAddress(userId: string, addressData: Omit<Address, 'id' | 'userId'>): Promise<string | null> {
  if (!db) {
    console.error("Firestore 'db' object is not initialized. Cannot add address.");
    return null;
  }
  if (!userId) {
    console.error("User ID is required to add an address.");
    return null;
  }

  try {
    const addressesRef = collection(db, 'users', userId, 'addresses');
    
    // If setting new address as default, ensure others are not default
    if (addressData.isDefault) {
        const q = query(addressesRef, where("isDefault", "==", true));
        const snapshot = await getDocs(q);
        for (const docSnap of snapshot.docs) {
            await updateDoc(doc(db, 'users', userId, 'addresses', docSnap.id), { isDefault: false });
        }
    }

    const newAddressRef = await addDoc(addressesRef, {
      ...addressData,
      userId: userId, // Store userId for potential broader queries if needed, though subcollection implies it
      createdAt: Timestamp.now(), // Optional: for tracking
    });
    return newAddressRef.id;
  } catch (error) {
    console.error("Error adding address for user ${userId}: ", error);
    return null;
  }
}

export async function updateUserAddress(userId: string, addressId: string, addressData: Partial<Omit<Address, 'id' | 'userId'>>): Promise<boolean> {
  if (!db) {
    console.error("Firestore 'db' object is not initialized. Cannot update address.");
    return false;
  }
   if (!userId || !addressId) {
    console.error("User ID and Address ID are required to update an address.");
    return false;
  }
  try {
    const addressDocRef = doc(db, 'users', userId, 'addresses', addressId);

    // If setting this address as default, ensure others are not default
    if (addressData.isDefault) {
        const addressesRef = collection(db, 'users', userId, 'addresses');
        const q = query(addressesRef, where("isDefault", "==", true));
        const snapshot = await getDocs(q);
        for (const docSnap of snapshot.docs) {
            if (docSnap.id !== addressId) { // Don't unset the one we are trying to set
                 await updateDoc(doc(db, 'users', userId, 'addresses', docSnap.id), { isDefault: false });
            }
        }
    }

    await updateDoc(addressDocRef, addressData);
    return true;
  } catch (error) {
    console.error(`Error updating address ${addressId} for user ${userId}: `, error);
    return false;
  }
}

export async function deleteUserAddress(userId: string, addressId: string): Promise<boolean> {
  if (!db) {
    console.error("Firestore 'db' object is not initialized. Cannot delete address.");
    return false;
  }
  if (!userId || !addressId) {
    console.error("User ID and Address ID are required to delete an address.");
    return false;
  }
  try {
    const addressDocRef = doc(db, 'users', userId, 'addresses', addressId);
    await deleteDoc(addressDocRef);
    return true;
  } catch (error) {
    console.error(`Error deleting address ${addressId} for user ${userId}: `, error);
    return false;
  }
}

