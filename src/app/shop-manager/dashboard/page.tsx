
"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LayoutDashboard, ShoppingBag, ListOrdered, DollarSign } from 'lucide-react';

export default function ShopManagerDashboardPage() {
  // Placeholder data - replace with actual data fetching logic
  const stats = {
    activeListings: 0, // Replace with actual count of products managed by this shop manager
    pendingOrders: 0,  // Replace with actual count of orders assigned or relevant to this manager
    totalSalesMonth: 0, // Replace with actual sales data for this manager
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground font-headline flex items-center">
            <LayoutDashboard className="mr-3 h-7 w-7 text-primary" />
            Shop Manager Dashboard
          </h1>
          <p className="text-muted-foreground text-sm">Overview of your managed products and orders.</p>
        </div>
        {/* Add relevant action button if needed, e.g., <Button>Add New Product</Button> */}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeListings}</div>
            <p className="text-xs text-muted-foreground">Products currently for sale.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <ListOrdered className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingOrders}</div>
            <p className="text-xs text-muted-foreground">Orders requiring your attention.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales (This Month)</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KES {stats.totalSalesMonth.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total sales revenue generated.</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Welcome, Shop Manager!</CardTitle>
          <CardDescription>
            This is your dashboard. Use the sidebar to navigate to manage your products, orders, and settings.
            More features and detailed analytics will be added soon.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Currently, product and order management sections are placeholders.
            Data fetching for your specific listings and orders will be implemented in future updates.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
