
"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, ListOrdered, Eye, Filter, Search } from 'lucide-react';
import { getAllOrdersForAdmin, type OrderAdminItem, type OrderStatus } from '@/services/orderService';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderAdminItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');

  useEffect(() => {
    document.title = "Manage Orders - Admin";
    async function fetchOrders() {
      setIsLoading(true);
      try {
        const fetchedOrders = await getAllOrdersForAdmin();
        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Error fetching orders for admin:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
        (order.orderId && order.orderId.toLowerCase().includes(searchLower)) ||
        (order.userEmail && order.userEmail.toLowerCase().includes(searchLower)) ||
        (order.shippingAddress.name && order.shippingAddress.name.toLowerCase().includes(searchLower)) ||
        (order.id && order.id.toLowerCase().includes(searchLower));
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  
  const orderStatuses: OrderStatus[] = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground font-headline flex items-center">
            <ListOrdered className="mr-3 h-7 w-7 text-primary" />
            Manage Orders
          </h1>
          <p className="text-muted-foreground text-sm">View and manage all customer orders.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Orders ({filteredOrders.length})</CardTitle>
          <CardDescription>List of all orders placed by customers.</CardDescription>
          <div className="flex flex-col sm:flex-row gap-2 mt-2 items-center">
            <div className="relative w-full sm:flex-grow">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by Order ID, Email, Name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-full"
                />
            </div>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as OrderStatus | 'all')}>
                <SelectTrigger className="w-full sm:w-auto sm:min-w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {orderStatuses.map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : filteredOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead className="hidden md:table-cell">Date</TableHead>
                    <TableHead>Total (KES)</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium text-primary">#{order.orderId || order.id.substring(0,8)}</TableCell>
                      <TableCell className="max-w-[150px] sm:max-w-xs truncate">
                        <div title={order.shippingAddress.name || `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`}>{order.shippingAddress.name || `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`}</div>
                        <div className="text-xs text-muted-foreground" title={order.userEmail || 'N/A'}>{order.userEmail || 'N/A'}</div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{format(order.orderDate.toDate(), 'dd MMM yyyy, HH:mm')}</TableCell>
                      <TableCell>{order.totalAmount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge 
                            variant={order.status === 'Delivered' ? 'default' : order.status === 'Cancelled' ? 'destructive' : 'secondary'}
                            className="text-xs capitalize whitespace-nowrap" 
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/admin/orders/${order.id}`} passHref legacyBehavior>
                          <Button as="a" variant="outline" size="sm">
                            <span>
                              <Eye className="mr-1 h-3.5 w-3.5 inline-block" /> View
                            </span>
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-10">No orders found matching your criteria.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
