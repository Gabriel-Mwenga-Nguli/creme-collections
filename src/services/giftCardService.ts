
'use server';

import { Timestamp } from 'firebase/firestore';

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
  console.log('[DEV MODE] Firestore is disabled. Simulating gift card creation.');
  console.log('[DEV MODE] Gift card data:', data);
  // Simulate successful creation by returning a mock ID
  return `mock_gift_card_${Date.now()}`;
}
