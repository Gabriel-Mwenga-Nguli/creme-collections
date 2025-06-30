
'use server';

import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';

export interface GiftCard {
  id: string; // Firestore document ID
  code: string; // The redeemable code
  initialBalance: number;
  currentBalance: number;
  recipientEmail: string;
  senderName: string;
  message: string;
  designImageUrl: string;
  createdAt: Date | Timestamp;
  expiryDate: Date | Timestamp;
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
  try {
    const createdAt = new Date();
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);

    const giftCardData = {
      code: generateGiftCardCode(),
      initialBalance: data.amount,
      currentBalance: data.amount,
      recipientEmail: data.recipientEmail,
      senderName: data.senderName,
      message: data.message,
      designImageUrl: data.designImageUrl,
      createdAt: Timestamp.fromDate(createdAt),
      expiryDate: Timestamp.fromDate(expiryDate),
      isRedeemed: false,
    };

    const docRef = await addDoc(collection(db, 'giftCards'), giftCardData);
    console.log("Gift Card created with ID: ", docRef.id);
    
    // In a real app, you would trigger an email to the recipient here.
    
    return docRef.id;
  } catch (error) {
    console.error("Error creating gift card: ", error);
    return null;
  }
}
