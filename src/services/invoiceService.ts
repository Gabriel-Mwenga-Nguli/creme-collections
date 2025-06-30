
'use server';

import { db, isConfigured } from '@/lib/firebase';

export interface Invoice {
  id: string;
  invoiceId: string;
  orderId: string;
  totalAmount: number;
  invoiceDate: Date;
  status: 'Paid' | 'Refunded';
  subject: string;
}

export async function getUserInvoices(userId: string): Promise<Invoice[]> {
  if (!isConfigured || !db) {
    console.warn("[Demo Mode] getUserInvoices called. Returning empty array.");
    return [];
  }
  console.log(`Firestore is enabled. Would fetch invoices for user ${userId}.`);
  return [];
}
