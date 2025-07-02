
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

// Mocked Service Functions for Demo Mode

export async function getUserOrders(userId: string): Promise<Order[]> {
    console.log(`[Demo Mode] getUserOrders called for user ${userId}. Returning empty array.`);
    return [];
}

export async function getOrderDetails(orderId: string, userId?: string): Promise<Order | null> {
    console.log(`[Demo Mode] getOrderDetails called for order ${orderId}. Returning null.`);
    return null;
}

export async function getAllOrdersForAdmin(countLimit?: number): Promise<OrderAdminItem[]> {
    console.log(`[Demo Mode] getAllOrdersForAdmin called. Returning empty array.`);
    return [];
}

export async function updateOrderStatus(orderId: string, newStatus: OrderStatus): Promise<boolean> {
    console.warn(`[Demo Mode] updateOrderStatus for ${orderId} ignored.`);
    return true;
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
    console.warn("[Demo Mode] createOrder called. No data will be saved to Firestore.");
    console.log({ userId, userEmail, items, totalAmount, shippingAddress });
    return `mock_order_${Date.now()}`;
}
