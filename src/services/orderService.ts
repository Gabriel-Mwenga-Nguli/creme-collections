
'use server';

import { Timestamp } from 'firebase/firestore';

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
  console.log(`[Mock Service] Called getUserOrders for user ${userId}. Firestore is disabled.`);
  // Return mock orders for a specific mock user for demonstration
  if (userId.startsWith('mock_user')) {
    return [
      { id: 'mock_ord_1', userId, orderId: 'CR12345', totalAmount: 15498, status: 'Delivered', orderDate: new Date('2024-06-20T10:30:00Z'), items: [], shippingAddress: { name: 'Mock User', addressLine1: '123 Test St', city: 'Nairobi', postalCode: '00100', phone: '123456789' } },
      { id: 'mock_ord_2', userId, orderId: 'CR12346', totalAmount: 2499, status: 'Shipped', orderDate: new Date('2024-06-22T15:00:00Z'), items: [], shippingAddress: { name: 'Mock User', addressLine1: '123 Test St', city: 'Nairobi', postalCode: '00100', phone: '123456789' } },
    ];
  }
  return [];
}

export async function getOrderDetails(orderId: string, userId?: string): Promise<Order | null> {
  console.log(`[Mock Service] Called getOrderDetails for order ${orderId}. Firestore is disabled.`);
  if (orderId === 'mock_ord_1') {
      return { id: 'mock_ord_1', userId: 'mock_user_1', orderId: 'CR12345', totalAmount: 15498, status: 'Delivered', orderDate: new Date('2024-06-20T10:30:00Z'), items: [], shippingAddress: { name: 'Mock User', addressLine1: '123 Test St', city: 'Nairobi', postalCode: '00100', phone: '123456789' } };
  }
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
  console.log('[DEV MODE] createOrder called. Firestore is disabled.');
  return `mock_order_${Date.now()}`;
}
