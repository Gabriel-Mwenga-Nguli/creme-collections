
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

const MOCK_ORDERS_ADMIN: OrderAdminItem[] = [
    { id: 'admin_ord_1', orderId: 'ORD746352', userId: 'user1', userEmail: 'john.doe@example.com', items: [{ productId: '1', name: 'Modern Smartwatch Series X', quantity: 1, priceAtPurchase: 12999, image: 'https://placehold.co/64x64.png' }], totalAmount: 12999, status: 'Delivered', orderDate: new Date('2024-06-20'), shippingAddress: { name: 'John Doe', addressLine1: '123 Riverside Drive', city: 'Nairobi', postalCode: '00100', phone: '+254712345678' } },
    { id: 'admin_ord_2', orderId: 'ORD741988', userId: 'user2', userEmail: 'jane.smith@example.com', items: [{ productId: '2', name: 'Classic Men\'s Polo Shirt', quantity: 1, priceAtPurchase: 2499, image: 'https://placehold.co/64x64.png' }], totalAmount: 2499, status: 'Shipped', orderDate: new Date('2024-06-18'), shippingAddress: { name: 'Jane Smith', addressLine1: '456 Othaya Road', city: 'Nairobi', postalCode: '00200', phone: '+254723456789' } },
];

export async function getUserOrders(userId: string): Promise<Order[]> {
    console.log(`[Demo Mode] getUserOrders called for user ${userId}. Returning empty array.`);
    return [];
}

export async function getOrderDetails(orderId: string, userId?: string): Promise<Order | null> {
    console.warn(`[Demo Mode] getOrderDetails called for order ${orderId}. Returning mock data.`);
    const order = MOCK_ORDERS_ADMIN.find(o => o.id === orderId);
    if (userId && order && order.userId !== userId) {
        return null;
    }
    return order ? JSON.parse(JSON.stringify(order)) : null;
}

export async function getAllOrdersForAdmin(countLimit?: number): Promise<OrderAdminItem[]> {
    console.warn("[Demo Mode] getAllOrdersForAdmin called. Returning mock data.");
    const limitedOrders = countLimit ? MOCK_ORDERS_ADMIN.slice(0, countLimit) : MOCK_ORDERS_ADMIN;
    return JSON.parse(JSON.stringify(limitedOrders));
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
