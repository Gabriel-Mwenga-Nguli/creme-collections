
'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs, query, limit, orderBy, Timestamp, where, getCountFromServer } from 'firebase/firestore';
import type { Product } from './productService'; // Assuming Product type is defined
import type { OrderAdminItem } from './orderService'; // Assuming Order type includes necessary fields

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
  if (!db) {
    console.error("Firestore 'db' object is not initialized.");
    throw new Error("Database not available");
  }

  try {
    // Total Products
    const productsRef = collection(db, 'products');
    const productsSnapshot = await getCountFromServer(productsRef);
    const totalProducts = productsSnapshot.data().count;

    // Total Orders & Sales
    const ordersRef = collection(db, 'orders'); // Assuming a top-level 'orders' collection for admin
    const allOrdersSnapshot = await getDocs(ordersRef);
    const totalOrders = allOrdersSnapshot.size;
    const totalSales = allOrdersSnapshot.docs.reduce((sum, doc) => sum + (doc.data().totalAmount || 0), 0);
    
    // Low Stock Products (e.g., stock < 5)
    const lowStockQuery = query(productsRef, where('stock', '<', 5));
    const lowStockSnapshot = await getCountFromServer(lowStockQuery);
    const lowStockProducts = lowStockSnapshot.data().count;
    
    // New Users (Placeholder - This is complex without a dedicated user collection or functions)
    // For now, returning a static number or 0.
    // In a real app, you might query a 'users' collection if you mirror auth users there,
    // or have a Firebase Function update a 'user_stats' document.
    const newUsers = 0; // Placeholder

    return {
      totalProducts,
      totalOrders,
      totalSales,
      newUsers, // Placeholder
      lowStockProducts,
      salesChange: Math.random() * 20 - 10, // Random +/- 10%
      ordersChange: Math.random() * 15 - 7, // Random +/- 7.5%
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    // Return default/error state or re-throw
    return { totalProducts: 0, totalOrders: 0, totalSales: 0, newUsers: 0, lowStockProducts: 0 };
  }
}


// Example: Get recent products (could be used for a "Recently Added" section)
export async function getRecentProductsForAdmin(count: number = 5): Promise<Product[]> {
  if (!db) {
    console.error("Firestore 'db' object is not initialized.");
    return [];
  }
  try {
    const productsRef = collection(db, 'products');
    const q = query(productsRef, orderBy('createdAt', 'desc'), limit(count)); // Assuming products have a 'createdAt' field
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
  } catch (error) {
    console.error("Error fetching recent products for admin:", error);
    return [];
  }
}
