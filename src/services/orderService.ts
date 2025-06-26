
'use server';

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
  orderDate: Date;
  shippingAddress: OrderShippingAddress; 
}

export interface OrderAdminItem extends Order {
    userEmail?: string;
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  console.log(`[Mock Service] Called getUserOrders for user ${userId}. Firestore is disabled.`);
  return [];
}

export async function getOrderDetails(orderId: string, userId?: string): Promise<Order | null> {
  console.log(`[Mock Service] Called getOrderDetails for order ${orderId}. Firestore is disabled.`);
  return null;
}

export async function getAllOrdersForAdmin(countLimit?: number): Promise<OrderAdminItem[]> {
  console.log(`[Mock Service] Called getAllOrdersForAdmin. Firestore is disabled.`);
  return [];
}

export async function updateOrderStatus(orderId: string, newStatus: OrderStatus): Promise<boolean> {
    console.log(`[Mock Service] Called updateOrderStatus for order ${orderId}. Firestore is disabled.`);
    return true;
}

export async function createOrder(
    userId: string,
    userEmail: string | null, 
    items: OrderItem[],
    totalAmount: number,
    shippingAddress: OrderShippingAddress
): Promise<string | null> {
    console.log(`[Mock Service] Called createOrder for user ${userId}. Firestore is disabled.`);
    return `mock_order_${Date.now()}`;
}
