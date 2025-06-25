
"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';

const mockOrders = [
  { id: 'ORD746352', customer: 'John Doe', date: '2024-06-20', status: 'Delivered', total: 15498 },
  { id: 'ORD741988', customer: 'Jane Smith', date: '2024-06-15', status: 'Shipped', total: 2499 },
  { id: 'ORD739812', customer: 'Bob Johnson', date: '2024-06-01', status: 'Processing', total: 850 },
  { id: 'ORD735110', customer: 'Alice Williams', date: '2024-05-25', status: 'Cancelled', total: 3200 },
  { id: 'ORD735109', customer: 'Chris Brown', date: '2024-05-24', status: 'Pending', total: 12500 },
];

const statusVariantMap = {
  Delivered: 'default',
  Shipped: 'secondary',
  Processing: 'outline',
  Pending: 'outline',
  Cancelled: 'destructive',
} as const;

export default function AdminOrdersPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-headline">Orders</h1>
        <p className="text-muted-foreground">View and manage all customer orders.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
          <CardDescription>A list of all orders placed on your website.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockOrders.map((order) => (
                <TableRow key={order.id} className="cursor-pointer" onClick={() => router.push(`/admin/orders/${order.id}`)}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariantMap[order.status as keyof typeof statusVariantMap] || 'default'}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">KES {order.total.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions for order {order.id}</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => router.push(`/admin/orders/${order.id}`)}>View Details</DropdownMenuItem>
                        <DropdownMenuItem disabled>Update Status</DropdownMenuItem>
                        <DropdownMenuItem disabled>Print Invoice</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
