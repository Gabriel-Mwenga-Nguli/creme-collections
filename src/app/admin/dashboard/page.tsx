
"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { BarChart3, ShoppingBag, ListOrdered, Users, Activity, AlertTriangle, DollarSign, Clock, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import StatCard from '@/components/admin/StatCard';
import SalesTrendChart from '@/components/admin/charts/SalesTrendChart'; 
import CategoryPieChart from '@/components/admin/charts/CategoryPieChart'; 
import { getDashboardStats, type DashboardStats } from '@/services/adminService'; 
import { getAllOrdersForAdmin, type OrderAdminItem } from '@/services/orderService';
import { format } from 'date-fns';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<OrderAdminItem[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    document.title = "Admin Dashboard - Creme Collections";
    async function fetchData() {
      setLoadingStats(true);
      try {
        const fetchedStats = await getDashboardStats();
        setStats(fetchedStats);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoadingStats(false);
      }

      setLoadingOrders(true);
      try {
        const fetchedOrders = await getAllOrdersForAdmin(5); 
        setRecentOrders(fetchedOrders);
      } catch (error) {
        console.error("Error fetching recent orders:", error);
      } finally {
        setLoadingOrders(false);
      }
    }
    fetchData();
  }, []);

  const salesChartData = [ 
    { name: 'Mon', sales: Math.floor(Math.random() * 5000) + 1000 },
    { name: 'Tue', sales: Math.floor(Math.random() * 5000) + 1000 },
    { name: 'Wed', sales: Math.floor(Math.random() * 5000) + 1000 },
    { name: 'Thu', sales: Math.floor(Math.random() * 5000) + 1000 },
    { name: 'Fri', sales: Math.floor(Math.random() * 5000) + 1000 },
    { name: 'Sat', sales: Math.floor(Math.random() * 5000) + 1000 },
    { name: 'Sun', sales: Math.floor(Math.random() * 5000) + 1000 },
  ];

  const categoryData = [ 
    { name: 'Electronics', value: 400, fill: 'hsl(var(--chart-1))' },
    { name: 'Fashion', value: 300, fill: 'hsl(var(--chart-2))' },
    { name: 'Home', value: 200, fill: 'hsl(var(--chart-3))' },
    { name: 'Beauty', value: 278, fill: 'hsl(var(--chart-4))' },
    { name: 'Sports', value: 189, fill: 'hsl(var(--chart-5))' },
  ];


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground font-headline flex items-center">
            <BarChart3 className="mr-3 h-7 w-7 text-primary" />
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground text-sm">Overview of your shop's performance and activity.</p>
        </div>
        <Link href="/admin/products/add" passHref legacyBehavior>
          <Button as="a">Add New Product</Button>
        </Link>
      </div>
      
      <Separator />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Sales" value={stats?.totalSales !== undefined ? `KES ${stats.totalSales.toLocaleString()}` : 'Loading...'} icon={DollarSign} description={stats?.salesChange !== undefined ? `${stats.salesChange >= 0 ? '+' : ''}${stats.salesChange.toFixed(1)}% from last month` : ''} trend={stats?.salesChange !== undefined ? (stats.salesChange >= 0 ? 'up' : 'down') : undefined} isLoading={loadingStats} />
        <StatCard title="Total Orders" value={stats?.totalOrders?.toLocaleString() ?? 'Loading...'} icon={ListOrdered} description={stats?.ordersChange !== undefined ? `${stats.ordersChange >= 0 ? '+' : ''}${stats.ordersChange.toFixed(1)}% from last month` : ''} trend={stats?.ordersChange !== undefined ? (stats.ordersChange >= 0 ? 'up' : 'down') : undefined} isLoading={loadingStats} />
        <StatCard title="Total Products" value={stats?.totalProducts?.toLocaleString() ?? 'Loading...'} icon={ShoppingBag} description="All listed products" isLoading={loadingStats} />
        <StatCard title="New Users" value={stats?.newUsers?.toLocaleString() ?? 'Loading...'} icon={Users} description="In the last 30 days" isLoading={loadingStats} />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Sales Trend (Last 7 Days)</CardTitle>
            <CardDescription>Visual representation of sales performance.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] md:h-[350px]">
            <SalesTrendChart data={salesChartData} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Product Categories</CardTitle>
             <CardDescription>Distribution of products across categories.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] md:h-[350px] flex items-center justify-center">
            <CategoryPieChart data={categoryData} />
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-1">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Last 5 orders placed on the website.</CardDescription>
            </div>
            <Link href="/admin/orders" passHref legacyBehavior>
              <Button as="a" variant="outline" size="sm">View All Orders</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {loadingOrders ? <p className="text-muted-foreground text-sm">Loading recent orders...</p> :
              recentOrders.length > 0 ? (
                <ul className="space-y-3">
                  {recentOrders.map(order => (
                    <li key={order.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 border rounded-md hover:bg-muted/50">
                      <div>
                        <Link href={`/admin/orders/${order.id}`} className="font-medium text-sm text-primary hover:underline">
                          Order #{order.orderId || order.id.substring(0,8)}
                        </Link>
                        <p className="text-xs text-muted-foreground">
                          {order.userEmail || 'Customer Email N/A'} - {order.items.length} item(s)
                        </p>
                      </div>
                      <div className="text-left sm:text-right mt-1 sm:mt-0">
                        <p className="text-sm font-semibold">KES {order.totalAmount.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">{order.status} - {format(order.orderDate.toDate(), 'PP')}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : <p className="text-muted-foreground text-sm">No recent orders found.</p>
            }
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
            <CardTitle className="flex items-center"><Activity className="mr-2 h-5 w-5 text-primary"/>Uptime &amp; Performance Monitoring</CardTitle>
            <CardDescription>Overview of website availability and speed.</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-10">
            <AlertTriangle className="mx-auto h-12 w-12 text-amber-500 mb-4" />
            <p className="text-lg font-medium text-foreground">Uptime Monitoring Requires External Service</p>
            <p className="text-sm text-muted-foreground mt-2">
                To accurately monitor website uptime and performance, integration with a dedicated external monitoring service (e.g., UptimeRobot, Better Uptime, Google Cloud Monitoring) is recommended.
            </p>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold text-sm">Current Status (Placeholder)</h4>
                    <p className="text-2xl font-bold text-green-500 mt-1">Operational</p>
                    <p className="text-xs text-muted-foreground">Last checked: Just now</p>
                </div>
                 <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold text-sm">90-Day Uptime (Placeholder)</h4>
                    <p className="text-2xl font-bold text-green-500 mt-1">99.98%</p>
                    <p className="text-xs text-muted-foreground">Calculated from mock data</p>
                </div>
            </div>
        </CardContent>
    </Card>

    </div>
  );
}
