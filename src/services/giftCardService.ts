
'use server';

import { Timestamp } from 'firebase/firestore';

export interface GiftCard {
  id: string; 
  code: string;
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

// Mocked Service Function for Demo Mode

export async function createGiftCard(data: {
  recipientEmail: string;
  senderName: string;
  amount: number;
  message: string;
  designImageUrl: string;
}): Promise<string | null> {
    console.warn("[Demo Mode] createGiftCard called. No data will be saved to Firestore.");
    console.log("[Demo Mode] Gift card data:", data);
    return `mock_giftcard_${Date.now()}`;
}
