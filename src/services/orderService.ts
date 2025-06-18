
'use server';

import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, getDoc, orderBy, Timestamp, updateDoc, addDoc } from 'firebase/firestore';

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  priceAtPurchase: number; 
  image: string;
}

export interface OrderShippingAddress {
    name: string; // Full name, or first + last
    firstName?: string; // if name is not full name
    lastName?: string; // if name is not full name
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
  userEmail?: string; // Added for admin view
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  orderDate: Timestamp;
  shippingAddress: OrderShippingAddress; 
}

// For admin listing, might want to include user email directly
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
    userId: data.userId,
    userEmail: data.userEmail, // Will be undefined if not present, handle in UI
    orderId: data.orderId || document.id, 
    items: data.items || [],
    totalAmount: data.totalAmount || 0,
    status: data.status || 'Pending',
    orderDate: data.orderDate || Timestamp.now(), 
    shippingAddress: data.shippingAddress || {},
  };
}

// Fetches orders for a specific user
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
    // Assuming orders are stored under a top-level 'orders' collection, filtered by userId
    // Or, if orders are in a subcollection: collection(db, 'users', userId, 'orders')
    const ordersRef = collection(db, 'orders'); 
    const q = query(ordersRef, where('userId', '==', userId), orderBy('orderDate', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const orders = querySnapshot.docs.map(docSnapshot => mapDocToOrder(docSnapshot));
    return orders;
  } catch (error) {
    console.error(`Error fetching orders for user ${userId}: `, error);
    return [];
  }
}

// Fetches details for a specific order (can be used by user or admin if they have the orderId)
export async function getOrderDetails(orderId: string): Promise<Order | null> {
  if (!db) {
    console.error("Firestore 'db' object is not initialized. Cannot fetch order details.");
    return null;
  }
   if (!orderId) {
    console.error("Order ID is required to fetch order details.");
    return null;
  }
  try {
    // Assuming orders are in a top-level 'orders' collection
    const orderDocRef = doc(db, 'orders', orderId);
    const orderSnap = await getDoc(orderDocRef);

    if (orderSnap.exists()) {
      return mapDocToOrder(orderSnap);
    } else {
      console.log(`No such order document with ID: ${orderId}`);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching order details for order ID ${orderId}: `, error);
    return null;
  }
}


// Fetches all orders for admin dashboard
export async function getAllOrdersForAdmin(countLimit?: number): Promise<OrderAdminItem[]> {
  if (!db) {
    console.error("Firestore 'db' object is not initialized. Cannot fetch all orders for admin.");
    return [];
  }
  try {
    const ordersRef = collection(db, 'orders'); // Assuming a top-level 'orders' collection
    let q = query(ordersRef, orderBy('orderDate', 'desc'));
    if (countLimit) {
        q = query(ordersRef, orderBy('orderDate', 'desc'), limit(countLimit));
    }
    const querySnapshot = await getDocs(q);
    
    const orders = querySnapshot.docs.map(docSnapshot => mapDocToOrder(docSnapshot) as OrderAdminItem);
    return orders;
  } catch (error) {
    console.error("Error fetching all orders for admin: ", error);
    return [];
  }
}

// Admin: Update order status
export async function updateOrderStatus(orderId: string, newStatus: OrderStatus): Promise<boolean> {
    if (!db) {
        console.error("Firestore 'db' object is not initialized. Cannot update order status.");
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


// Example: Create a new order (e.g., from checkout)
// This would typically be more complex, involving transaction, inventory updates etc.
export async function createOrder(
    userId: string,
    userEmail: string | null, // Add userEmail
    items: OrderItem[],
    totalAmount: number,
    shippingAddress: OrderShippingAddress
): Promise<string | null> {
    if (!db) {
        console.error("Firestore 'db' object is not initialized. Cannot create order.");
        return null;
    }
    try {
        // For a real system, you would generate a more robust orderId
        const simpleOrderId = `CREME-${Date.now().toString().slice(-6)}`;

        const ordersRef = collection(db, 'orders'); // Assumes top-level 'orders'
        const newOrderData = {
            orderId: simpleOrderId,
            userId: userId,
            userEmail: userEmail || null, // Store user's email
            items: items,
            totalAmount: totalAmount,
            shippingAddress: shippingAddress,
            status: 'Pending' as OrderStatus,
            orderDate: serverTimestamp(),
        };
        const docRef = await addDoc(ordersRef, newOrderData);
        return docRef.id; // Returns Firestore document ID
    } catch (error) {
        console.error("Error creating order: ", error);
        return null;
    }
}
