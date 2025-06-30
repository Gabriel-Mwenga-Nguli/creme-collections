
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

const MOCK_ORDERS: Order[] = [
    { 
        id: 'mock_ord_1', userId: 'mock_user_google.user@example.com', orderId: 'CR12345', totalAmount: 15498, status: 'Delivered', orderDate: new Date('2024-06-20T10:30:00Z'),
        items: [
            { productId: 'loy-1', name: 'Modern Smartwatch Series X', quantity: 1, priceAtPurchase: 12999, image: '/images/products/smartwatch_main.png' },
            { productId: 'loy-2', name: 'Classic Men\'s Polo Shirt', quantity: 1, priceAtPurchase: 2499, image: '/images/products/polo_shirt_blue.png' },
        ],
        shippingAddress: { name: 'Google User', addressLine1: '123 Test St', city: 'Nairobi', postalCode: '00100', phone: '+254712345678' } 
    },
    { 
        id: 'mock_ord_2', userId: 'mock_user_google.user@example.com', orderId: 'CR12346', totalAmount: 19999, status: 'Shipped', orderDate: new Date('2024-06-22T15:00:00Z'),
        items: [
            { productId: 'loy-4', name: 'Wireless Noise-Cancelling Headphones', quantity: 1, priceAtPurchase: 19999, image: '/images/products/headphones.png' },
        ],
        shippingAddress: { name: 'Google User', addressLine1: '456 Second Ave', city: 'Nairobi', postalCode: '00200', phone: '+254712345678' } 
    },
];

export async function getUserOrders(userId: string): Promise<Order[]> {
  console.log(`[Mock Service] Called getUserOrders for user ${userId}.`);
  // Return mock orders for a specific mock user for demonstration
  const userOrders = MOCK_ORDERS.filter(order => order.userId === userId);
  return userOrders;
}

export async function getOrderDetails(orderId: string, userId?: string): Promise<Order | null> {
  console.log(`[Mock Service] Called getOrderDetails for order ${orderId}.`);
  const order = MOCK_ORDERS.find(o => o.id === orderId);
  
  if (order) {
      // If a userId is provided, ensure the order belongs to that user
      if (userId && order.userId !== userId) {
          return null;
      }
      return order;
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
