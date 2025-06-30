
'use server';

import { db, isConfigured } from '@/lib/firebase';
import { collection, addDoc, getDocs, doc, getDoc, query, where, Timestamp, serverTimestamp, orderBy } from 'firebase/firestore';

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
  orderDate: Date | Timestamp;
  shippingAddress: OrderShippingAddress; 
}

export interface OrderAdminItem extends Order {
    userEmail?: string;
}

const fromFirestore = (docSnap: any): Order => {
  const data = docSnap.data();
  return {
    id: docSnap.id,
    ...data,
    orderDate: data.orderDate instanceof Timestamp ? data.orderDate.toDate() : new Date(),
  } as Order;
};


export async function getUserOrders(userId: string): Promise<Order[]> {
    if (!isConfigured || !db || !userId) return [];
    
    const ordersRef = collection(db, "orders");
    const q = query(ordersRef, where("userId", "==", userId), orderBy("orderDate", "desc"));

    try {
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(fromFirestore);
    } catch (error) {
        console.error("Error fetching user orders:", error);
        return [];
    }
}

export async function getOrderDetails(orderId: string, userId?: string): Promise<Order | null> {
    if (!isConfigured || !db) return null;
    
  const docRef = doc(db, "orders", orderId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const order = fromFirestore(docSnap);
    if (userId && order.userId !== userId) {
        return null;
    }
    return order;
  }
  return null;
}


export async function getAllOrdersForAdmin(countLimit?: number): Promise<OrderAdminItem[]> {
    if (!isConfigured || !db) return [];
  const ordersRef = collection(db, "orders");
  const q = query(ordersRef, orderBy("orderDate", "desc"));

  try {
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => fromFirestore(doc) as OrderAdminItem);
  } catch(e) {
      console.error("Error fetching all orders: ", e);
      return [];
  }
}


export async function updateOrderStatus(orderId: string, newStatus: OrderStatus): Promise<boolean> {
    if (!isConfigured || !db) {
        console.warn(`[Demo Mode] updateOrderStatus for ${orderId} ignored.`);
        return true;
    }
  const orderRef = doc(db, "orders", orderId);
  try {
      await updateDoc(orderRef, { status: newStatus });
      return true;
  } catch(e) {
      console.error(`Error updating order status for ${orderId}: `, e);
      return false;
  }
}

function generateReadableOrderId(): string {
  const prefix = "CR";
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 900 + 100).toString();
  return `${prefix}${timestamp}${random}`;
}


export async function createOrder(
    userId: string,
    userEmail: string | null, 
    items: OrderItem[],
    totalAmount: number,
    shippingAddress: OrderShippingAddress
): Promise<string | null> {
    if (!isConfigured || !db) {
        console.warn("[Demo Mode] createOrder called. No data will be saved.");
        return `mock_order_${Date.now()}`;
    }
  try {
    const docRef = await addDoc(collection(db, 'orders'), {
        userId,
        userEmail: userEmail || 'N/A',
        items,
        totalAmount,
        shippingAddress,
        status: 'Pending',
        orderDate: serverTimestamp(),
        orderId: generateReadableOrderId(),
    });
    console.log("Order created with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
      console.error("Error creating order: ", error);
      return null;
  }
}
