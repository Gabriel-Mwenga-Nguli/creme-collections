
"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ListOrdered, FileText, Loader2, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { getUserOrders, type Order } from '@/services/orderService';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const statusVariantMap: { [key in Order['status']]: 'default' | 'secondary' | 'outline' | 'destructive' } = {
  Delivered: 'default',
  Shipped: 'secondary',
  Processing: 'outline',
  Pending: 'outline',
  Cancelled: 'destructive',
};


export default function OrdersPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (isAuthLoading) return; // Wait until auth state is resolved

    async function fetchOrders() {
      if (user) {
        setIsLoading(true);
        const userOrders = await getUserOrders(user.uid);
        setOrders(userOrders);
        setIsLoading(false);
      } else {
        // If no user, redirect to login. This page should be protected.
        router.push('/login');
      }
    }
    fetchOrders();
  }, [user, isAuthLoading, router]);

  const renderContent = () => {
    if (isAuthLoading || isLoading) {
      return (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
      );
    }
    
    if (orders.length > 0) {
      return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">#{order.orderId || order.id.substring(0,8)}</TableCell>
                <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge variant={statusVariantMap[order.status] || 'default'}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">KES {order.totalAmount.toLocaleString()}</TableCell>
                <TableCell className="text-right">
                  <Button asChild variant="outline" size="sm">
                      <Link href={`/profile/orders/${order.id}`}>
                        <FileText className="mr-2 h-4 w-4" /> View
                      </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );
    }

    return (
       <div className="text-center py-16">
          <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground/30 mb-4" />
          <p className="text-lg font-semibold text-foreground mb-2">No Orders Yet</p>
          <p className="text-muted-foreground mb-6">
            You haven't placed any orders with us. Let's change that!
          </p>
          <Button asChild size="lg">
            <Link href="/products">Start Shopping</Link>
          </Button>
        </div>
    );
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-headline flex items-center">
            <ListOrdered className="mr-2 h-5 w-5 text-primary" /> My Orders
        </CardTitle>
        <CardDescription>View your order history and track current orders.</CardDescription>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
}
