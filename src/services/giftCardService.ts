
'use server';

export interface GiftCard {
  id: string; // Firestore document ID
  code: string; // The redeemable code
  initialBalance: number;
  currentBalance: number;
  recipientEmail: string;
  senderName: string;
  message: string;
  designImageUrl: string;
  createdAt: Date;
  expiryDate: Date;
  isRedeemed: boolean;
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
