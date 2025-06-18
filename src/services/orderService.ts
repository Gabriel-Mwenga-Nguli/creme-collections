
'use server';

import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, getDoc, orderBy, Timestamp } from 'firebase/firestore';

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  priceAtPurchase: number; // Price of a single item at the time of purchase
  image: string;
}

export interface OrderShippingAddress {
    name: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    postalCode: string;
    phone: string;
    country?: string;
}


export interface Order {
  id: string; // Firestore document ID
  orderId?: string; // Custom order identifier like CREME-ORD-001
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  orderDate: Timestamp;
  shippingAddress: OrderShippingAddress; 
  // Add other fields like paymentDetailsId, trackingNumber, etc. if needed
}

function mapDocToOrder(document: FirebaseFirestore.QueryDocumentSnapshot | FirebaseFirestore.DocumentSnapshot): Order {
  const data = document.data();
  if (!data) {
    throw new Error(`Order data is undefined for document ID: ${document.id}`);
  }
  return {
    id: document.id,
    userId: data.userId,
    orderId: data.orderId || document.id, // Fallback to doc ID if custom orderId is missing
    items: data.items || [],
    totalAmount: data.totalAmount || 0,
    status: data.status || 'Pending',
    orderDate: data.orderDate || Timestamp.now(), // Provide a default if missing
    shippingAddress: data.shippingAddress || {},
  };
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  if (!db) {
    console.error("Firestore 'db' object is not initialized. Cannot fetch user orders.");
    return [];
  }
  if (!userId) {
    console.error("User ID is required to fetch orders.");
    return [];
  }

  try {
    const ordersRef = collection(db, 'users', userId, 'orders');
    const q = query(ordersRef, orderBy('orderDate', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const orders = querySnapshot.docs.map(docSnapshot => mapDocToOrder(docSnapshot));
    return orders;
  } catch (error) {
    console.error(`Error fetching orders for user ${userId}: `, error);
    return [];
  }
}

export async function getOrderDetails(userId: string, orderId: string): Promise<Order | null> {
  if (!db) {
    console.error("Firestore 'db' object is not initialized. Cannot fetch order details.");
    return null;
  }
   if (!userId || !orderId) {
    console.error("User ID and Order ID are required to fetch order details.");
    return null;
  }
  try {
    const orderDocRef = doc(db, 'users', userId, 'orders', orderId);
    const orderSnap = await getDoc(orderDocRef);

    if (orderSnap.exists()) {
      return mapDocToOrder(orderSnap);
    } else {
      console.log(`No such order document with ID: ${orderId} for user ${userId}`);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching order details for order ID ${orderId}, user ${userId}: `, error);
    return null;
  }
}

// Example function to add an order (you'd call this after a successful checkout)
// This is illustrative and would typically be part of a more complex checkout flow.
export async function createOrder(userId: string, orderData: Omit<Order, 'id' | 'userId' | 'orderDate'>): Promise<string | null> {
  if (!db) {
    console.error("Firestore 'db' object is not initialized. Cannot create order.");
    return null;
  }
  try {
    const ordersRef = collection(db, 'users', userId, 'orders');
    const newOrderRef = await addDoc(ordersRef, {
      ...orderData,
      userId: userId,
      orderDate: Timestamp.now(), // Use server timestamp
    });
    return newOrderRef.id;
  } catch (error) {
    console.error("Error creating order: ", error);
    return null;
  }
}
