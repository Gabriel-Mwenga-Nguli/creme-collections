
'use server';

import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, getDoc, addDoc, updateDoc, Timestamp, orderBy, limit } from 'firebase/firestore';

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
  orderId?: string; // Human-readable order ID
  userId: string;
  userEmail?: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  orderDate: Date | Timestamp;
  shippingAddress: OrderShippingAddress; 
}

export interface OrderAdminItem extends Order {
    userEmail?: string;
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  try {
    const ordersRef = collection(db, "orders");
    const q = query(ordersRef, where("userId", "==", userId), orderBy("orderDate", "desc"));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            orderDate: (data.orderDate as Timestamp).toDate(),
        } as Order
    });
  } catch (error) {
    console.error("Error fetching user orders: ", error);
    return [];
  }
}

export async function getOrderDetails(orderId: string, userId?: string): Promise<Order | null> {
  try {
    const orderRef = doc(db, "orders", orderId);
    const docSnap = await getDoc(orderRef);
    if (!docSnap.exists()) {
      return null;
    }
    const orderData = docSnap.data() as Order;
    if (userId && orderData.userId !== userId) {
      return null; 
    }
     return {
      id: docSnap.id,
      ...orderData,
      orderDate: (orderData.orderDate as Timestamp).toDate(),
    };
  } catch (error) {
    console.error("Error fetching order details: ", error);
    return null;
  }
}

export async function getAllOrdersForAdmin(countLimit?: number): Promise<OrderAdminItem[]> {
   try {
    const ordersRef = collection(db, "orders");
    const q = countLimit 
        ? query(ordersRef, orderBy("orderDate", "desc"), limit(countLimit))
        : query(ordersRef, orderBy("orderDate", "desc"));
        
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            orderDate: (data.orderDate as Timestamp).toDate(),
        } as OrderAdminItem
    });
  } catch (error) {
    console.error("Error fetching all orders: ", error);
    return [];
  }
}

export async function updateOrderStatus(orderId: string, newStatus: OrderStatus): Promise<boolean> {
  try {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, { status: newStatus });
    return true;
  } catch (error) {
    console.error("Error updating order status: ", error);
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
    const orderRef = await addDoc(collection(db, "orders"), {
      userId,
      userEmail,
      items,
      totalAmount,
      shippingAddress,
      status: 'Pending',
      orderDate: Timestamp.now(),
      orderId: `CR${Date.now()}` // Simple human-readable ID
    });
    return orderRef.id;
  } catch (error) {
    console.error("Error creating order: ", error);
    return null;
  }
}
