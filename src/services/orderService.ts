
'use server';

import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, getDoc, orderBy, Timestamp, updateDoc, addDoc, limit, serverTimestamp } from 'firebase/firestore';

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
  orderDate: Timestamp;
  shippingAddress: OrderShippingAddress; 
}

export interface Address {
  id: string; // Firestore document ID
  userId: string;
  name: string; // e.g., "Home", "Work"
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postalCode: string;
  country: string; // Default to 'Kenya'
  phone: string;
  isDefault?: boolean;
}


export interface OrderAdminItem extends Order {
    userEmail?: string;
}


function mapDocToOrder(document: FirebaseFirestore.QueryDocumentSnapshot | FirebaseFirestore.DocumentSnapshot): Order {
  const data = document.data();
  if (!data) {
    throw new Error(`Order data is undefined for document ID: ${document.id}`);
  }
  return {
    id: document.id,
    userId: data.userId || 'Unknown User',
    userEmail: data.userEmail || undefined, 
    orderId: data.orderId || document.id, 
    items: data.items && Array.isArray(data.items) ? data.items : [],
    totalAmount: typeof data.totalAmount === 'number' ? data.totalAmount : 0,
    status: data.status || 'Pending',
    orderDate: data.orderDate instanceof Timestamp ? data.orderDate : Timestamp.now(), 
    shippingAddress: data.shippingAddress || { name: 'N/A', addressLine1: 'N/A', city: 'N/A', postalCode: 'N/A', phone: 'N/A' },
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
    const ordersRef = collection(db, 'orders'); 
    const q = query(ordersRef, where('userId', '==', userId), orderBy('orderDate', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const orders = querySnapshot.docs.map(docSnapshot => mapDocToOrder(docSnapshot));
    return orders;
  } catch (error: any) {
    if (error.code === 'permission-denied') {
      console.error(`[OrderService] FIREBASE PERMISSION ERROR fetching orders for user ${userId}. Check Firestore rules for the 'orders' collection.`);
    } else {
      console.error(`Error fetching orders for user ${userId}: `, error);
    }
    return [];
  }
}

export async function getOrderDetails(orderId: string, userId?: string): Promise<Order | null> {
    if (!db) {
        console.error("Firestore 'db' object is not initialized. Cannot fetch order details.");
        return null;
    }
    if (!orderId) {
        console.error("Order ID is required to fetch order details.");
        return null;
    }
    try {
        const orderDocRef = doc(db, 'orders', orderId);
        const orderSnap = await getDoc(orderDocRef);

        if (orderSnap.exists()) {
            const orderData = mapDocToOrder(orderSnap);
            // If userId is provided (for user-specific access), validate ownership
            if (userId && orderData.userId !== userId) {
                console.warn(`User ${userId} attempted to access order ${orderId} belonging to another user.`);
                return null; 
            }
            return orderData;
        } else {
            console.warn(`No such order document with ID: ${orderId}`);
            return null;
        }
    } catch (error: any) {
        if (error.code === 'permission-denied') {
            console.error(`[OrderService] FIREBASE PERMISSION ERROR fetching order details for order ID ${orderId}. Check Firestore rules.`);
        } else {
            console.error(`Error fetching order details for order ID ${orderId}: `, error);
        }
        return null;
    }
}


export async function getAllOrdersForAdmin(countLimit?: number): Promise<OrderAdminItem[]> {
  if (!db) {
    console.error("Firestore 'db' object is not initialized. Cannot fetch all orders for admin.");
    return [];
  }
  try {
    const ordersRef = collection(db, 'orders');
    let q;
    if (countLimit && countLimit > 0) {
        q = query(ordersRef, orderBy('orderDate', 'desc'), limit(countLimit));
    } else {
        q = query(ordersRef, orderBy('orderDate', 'desc'));
    }
    const querySnapshot = await getDocs(q);
    
    const orders = querySnapshot.docs.map(docSnapshot => mapDocToOrder(docSnapshot) as OrderAdminItem);
    return orders;
  } catch (error: any) {
     if (error.code === 'permission-denied') {
      console.error(`[OrderService] FIREBASE PERMISSION ERROR fetching all orders for admin. Check Firestore rules for the 'orders' collection.`);
    } else {
      console.error("Error fetching all orders for admin: ", error);
    }
    return [];
  }
}

export async function updateOrderStatus(orderId: string, newStatus: OrderStatus): Promise<boolean> {
    if (!db) {
        console.error("Firestore 'db' object is not initialized. Cannot update order status.");
        return false;
    }
    if (!orderId) {
        console.error("Order ID is required to update status.");
        return false;
    }
    try {
        const orderRef = doc(db, 'orders', orderId);
        await updateDoc(orderRef, { status: newStatus });
        return true;
    } catch (error) {
        console.error(`Error updating status for order ${orderId}:`, error);
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
    if (!db) {
        console.error("Firestore 'db' object is not initialized. Cannot create order.");
        return null;
    }
     if (!userId || !items || items.length === 0 || totalAmount <= 0 || !shippingAddress) {
        console.error("Invalid parameters for creating order.");
        return null;
    }
    try {
        const simpleOrderId = `CREME-${Date.now().toString().slice(-6)}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

        const ordersRef = collection(db, 'orders');
        const newOrderData = {
            orderId: simpleOrderId,
            userId: userId,
            userEmail: userEmail || null,
            items: items,
            totalAmount: totalAmount,
            shippingAddress: shippingAddress,
            status: 'Pending' as OrderStatus,
            orderDate: serverTimestamp(),
        };
        const docRef = await addDoc(ordersRef, newOrderData);
        return docRef.id;
    } catch (error) {
        console.error("Error creating order: ", error);
        return null;
    }
}
