
'use server';

export interface Invoice {
  id: string;
  invoiceId: string;
  orderId: string;
  totalAmount: number;
  invoiceDate: Date;
  status: 'Paid' | 'Refunded';
  subject: string;
}

// Mocked Service Function for Demo Mode

export async function getUserInvoices(userId: string): Promise<Invoice[]> {
  console.log(`[Demo Mode] Called getUserInvoices for user ${userId}. Returning empty array.`);
  return [];
}
