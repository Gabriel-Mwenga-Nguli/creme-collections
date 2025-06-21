
'use server';

import { db } from '@/lib/firebase';
import { collection, query, orderBy, getDocs, Timestamp } from 'firebase/firestore';

export interface Invoice {
  id: string;
  invoiceId: string;
  orderId: string;
  totalAmount: number;
  invoiceDate: Timestamp;
  status: 'Paid' | 'Refunded';
  subject: string;
}

// Helper to map Firestore doc to our Invoice interface
function mapDocToInvoice(document: FirebaseFirestore.QueryDocumentSnapshot): Invoice {
  const data = document.data();
  return {
    id: document.id,
    invoiceId: data.invoiceId || document.id,
    orderId: data.orderId || 'N/A',
    totalAmount: data.totalAmount || 0,
    invoiceDate: data.invoiceDate instanceof Timestamp ? data.invoiceDate : Timestamp.now(),
    status: data.status || 'Paid',
    subject: data.subject || 'Order Details',
  };
}


export async function getUserInvoices(userId: string): Promise<Invoice[]> {
  if (!db) {
    console.error("Firestore 'db' object is not initialized. Cannot fetch user invoices.");
    return [];
  }
  if (!userId) {
    console.error("User ID is required to fetch invoices.");
    return [];
  }

  try {
    const invoicesRef = collection(db, 'users', userId, 'invoices');
    const q = query(invoicesRef, orderBy('invoiceDate', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const invoices = querySnapshot.docs.map(docSnapshot => mapDocToInvoice(docSnapshot));
    return invoices;
  } catch (error) {
    console.error(`Error fetching invoices for user ${userId}: `, error);
    return [];
  }
}
