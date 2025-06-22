
'use server';

import { db } from '@/lib/firebase';
import { collection, addDoc, doc, getDoc, updateDoc, serverTimestamp, Timestamp } from 'firebase/firestore';

export interface GiftCard {
  id: string; // Firestore document ID
  code: string; // The redeemable code
  initialBalance: number;
  currentBalance: number;
  recipientEmail: string;
  senderName: string;
  message: string;
  designImageUrl: string;
  createdAt: Timestamp;
  expiryDate: Timestamp;
  isRedeemed: boolean;
}

// Function to generate a unique gift card code
function generateGiftCardCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 16; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
    if ((i + 1) % 4 === 0 && i < 15) {
      code += '-';
    }
  }
  return code;
}

export async function createGiftCard(data: {
  recipientEmail: string;
  senderName: string;
  amount: number;
  message: string;
  designImageUrl: string;
}): Promise<string | null> {
  if (!db) {
    console.error("Firestore 'db' object is not initialized. Cannot create gift card.");
    return null;
  }

  try {
    const code = generateGiftCardCode();
    const createdAt = Timestamp.now();
    const expiryDate = new Timestamp(createdAt.seconds + 365 * 24 * 60 * 60, createdAt.nanoseconds); // Expires in 1 year

    const giftCardsRef = collection(db, 'giftCards');
    const newCardData = {
      code,
      initialBalance: data.amount,
      currentBalance: data.amount,
      recipientEmail: data.recipientEmail,
      senderName: data.senderName,
      message: data.message,
      designImageUrl: data.designImageUrl,
      createdAt,
      expiryDate,
      isRedeemed: false,
    };

    const docRef = await addDoc(giftCardsRef, newCardData);
    return docRef.id; // Returns the Firestore document ID
  } catch (error) {
    console.error("Error creating gift card:", error);
    return null;
  }
}
