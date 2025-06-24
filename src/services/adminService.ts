
'use server';

import type { Product } from './productService';
import type { OrderAdminItem } from './orderService';

export interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalSales: number;
  newUsers: number; // Placeholder or from a dedicated user_stats collection
  lowStockProducts: number;
  salesChange?: number; // Percentage change from previous period
  ordersChange?: number; // Percentage change
}

export async function getDashboardStats(): Promise<DashboardStats> {
  console.log(`[Mock Service] Called getDashboardStats. Returning mock data.`);
  return {
    totalProducts: 5,
    totalOrders: 0,
    totalSales: 0,
    newUsers: 0,
    lowStockProducts: 1,
    salesChange: 5.2,
    ordersChange: -1.5,
  };
}

// Example: Get recent products (could be used for a "Recently Added" section)
export async function getRecentProductsForAdmin(count: number = 5): Promise<Product[]> {
  console.log(`[Mock Service] Called getRecentProductsForAdmin. Returning empty array.`);
  return [];
}
