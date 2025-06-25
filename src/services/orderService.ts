
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

// All functions now return empty/mock data to avoid backend calls.

export async function getUserOrders(userId: string): Promise<Order[]> {
  return [];
}

export async function getOrderDetails(orderId: string, userId?: string): Promise<Order | null> {
    return null;
}

export async function getAllOrdersForAdmin(countLimit?: number): Promise<OrderAdminItem[]> {
  return [];
}

export async function updateOrderStatus(orderId: string, newStatus: OrderStatus): Promise<boolean> {
    return true;
}

export async function createOrder(
    userId: string,
    userEmail: string | null, 
    items: OrderItem[],
    totalAmount: number,
    shippingAddress: OrderShippingAddress
): Promise<string | null> {
    return `mock_order_${Date.now()}`;
}
