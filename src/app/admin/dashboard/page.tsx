
"use client";

import React from 'react';
import StatCard from '@/components/admin/StatCard';
import { DollarSign, ListOrdered, Package, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import SalesTrendChart from '@/components/admin/charts/SalesTrendChart';
import CategoryPieChart from '@/components/admin/charts/CategoryPieChart';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const salesData = [
  { name: 'Jan', sales: 4000 },
  { name: 'Feb', sales: 3000 },
  { name: 'Mar', sales: 5000 },
  { name: 'Apr', sales: 4500 },
  { name: 'May', sales: 6000 },
  { name: 'Jun', sales: 5500 },
];

const categoryData = [
  { name: 'Electronics', value: 400, fill: 'hsl(var(--chart-1))' },
  { name: 'Fashion', value: 300, fill: 'hsl(var(--chart-2))' },
  { name: 'Home', value: 200, fill: 'hsl(var(--chart-3))' },
  { name: 'Books', value: 100, fill: 'hsl(var(--chart-4))' },
];

const recentOrders = [
    { id: 'ORD123', customer: 'John Doe', total: 'KES 150', status: 'Pending' },
    { id: 'ORD124', customer: 'Jane Smith', total: 'KES 350', status: 'Shipped' },
    { id: 'ORD125', customer: 'Bob Johnson', total: 'KES 720', status: 'Delivered' },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-headline">Admin Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Revenue" value="KES 45,231" description="+20.1% from last month" icon={DollarSign} trend="up" />
        <StatCard title="Total Orders" value="+12,234" description="+180.1% from last month" icon={ListOrdered} trend="up" />
        <StatCard title="Total Products" value="573" description="24 new products added" icon={Package} />
        <StatCard title="New Users" value="+573" description="+2 since last hour" icon={Users} trend="down" />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
            <CardDescription>A chart showing sales trends over the last 6 months.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] p-2">
            <SalesTrendChart data={salesData} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
            <CardDescription>A breakdown of product sales by category.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] p-2">
            <CategoryPieChart data={categoryData} />
          </CardContent>
        </Card>
      </div>

       <Card>
        <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>A list of the most recent orders placed on the website.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {recentOrders.map(order => (
                        <TableRow key={order.id}>
                            <TableCell className="font-medium">{order.id}</TableCell>
                            <TableCell>{order.customer}</TableCell>
                            <TableCell><Badge variant={order.status === 'Delivered' ? 'default' : 'secondary'}>{order.status}</Badge></TableCell>
                            <TableCell className="text-right">{order.total}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}
