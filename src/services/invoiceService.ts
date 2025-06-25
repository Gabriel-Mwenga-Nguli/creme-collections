
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

export async function getUserInvoices(userId: string): Promise<Invoice[]> {
  return [];
}
