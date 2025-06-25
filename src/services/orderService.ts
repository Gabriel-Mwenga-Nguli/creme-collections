
'use server';

import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, getDocs, doc, getDoc, addDoc, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore';

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  priceAtPurchase: number; 
  image: string;
}

export interface OrderShippingAddress {
    name: string; 
    firstName?: string; 
    lastName?: string; 
    addressLine1: string;
    addressLine2?: string;
    city: string;
    postalCode: string;
    phone: string;
    country?: string;
}

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string; 
  orderId?: string; 
  userId: string;
  userEmail?: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  orderDate: Date; // Keep as Date for client-side, convert from Timestamp
  shippingAddress: OrderShippingAddress; 
}

export interface OrderAdminItem extends Order {
    userEmail?: string;
}

const orderFromDoc = (doc: any): Order => {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    orderDate: (data.orderDate as Timestamp).toDate(),
  } as Order;
}


export async function getUserOrders(userId: string): Promise<Order[]> {
  const ordersRef = collection(db, 'orders');
  const q = query(ordersRef, where('userId', '==', userId), orderBy('orderDate', 'desc'));
  
  try {
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(orderFromDoc);
  } catch (error) {
    console.error("Error fetching user orders: ", error);
    return [];
  }
}

export async function getOrderDetails(orderId: string, userId?: string): Promise<Order | null> {
    const docRef = doc(db, "orders", orderId);
    try {
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
            return null;
        }
        const order = orderFromDoc(docSnap);

        // If userId is provided, ensure the order belongs to that user
        if (userId && order.userId !== userId) {
            return null;
        }
        return order;
    } catch(error) {
        console.error("Error fetching order details:", error);
        return null;
    }
}

export async function getAllOrdersForAdmin(countLimit?: number): Promise<OrderAdminItem[]> {
  const ordersRef = collection(db, 'orders');
  const q = query(ordersRef, orderBy('orderDate', 'desc'));
  // You could add a limit here if `countLimit` is provided.

  try {
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(orderFromDoc) as OrderAdminItem[];
  } catch(error) {
    console.error("Error fetching all admin orders:", error);
    return [];
  }
}

export async function updateOrderStatus(orderId: string, newStatus: OrderStatus): Promise<boolean> {
    const orderRef = doc(db, "orders", orderId);
    try {
        await updateDoc(orderRef, { status: newStatus });
        return true;
    } catch (error) {
        console.error("Error updating order status:", error);
        return false;
    }
}

export async function createOrder(
    userId: string,
    userEmail: string | null, 
    items: OrderItem[],
    totalAmount: number,
    shippingAddress: OrderShippingAddress
): Promise<string | null> {
    try {
        const orderRef = await addDoc(collection(db, 'orders'), {
            userId,
            userEmail,
            items,
            totalAmount,
            shippingAddress,
            status: 'Pending',
            orderDate: serverTimestamp(),
        });
        // Set a more human-readable orderId as well
        const readableOrderId = `ORD-${orderRef.id.substring(0, 6).toUpperCase()}`;
        await updateDoc(orderRef, { orderId: readableOrderId });

        return orderRef.id;
    } catch(error) {
        console.error("Error creating order:", error);
        return null;
    }
}
