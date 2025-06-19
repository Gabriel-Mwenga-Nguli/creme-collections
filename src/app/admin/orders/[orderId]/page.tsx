
"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Loader2, ChevronLeft, ShoppingBag, MapPin, Package, User as UserIcon, CreditCard, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getOrderDetails, updateOrderStatus, type Order, type OrderStatus } from '@/services/orderService';
import { format } from 'date-fns';

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newStatus, setNewStatus] = useState<OrderStatus | ''>('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const orderId = typeof params.orderId === 'string' ? params.orderId : null;
  
  const orderStatuses: OrderStatus[] = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  useEffect(() => {
    if (orderId) {
      document.title = `Order #${orderId.substring(0,8)} - Admin`;
      setIsLoading(true);
      getOrderDetails(orderId)
        .then(fetchedOrder => {
          if (fetchedOrder) {
            setOrder(fetchedOrder);
            setNewStatus(fetchedOrder.status);
          } else {
            toast({ title: "Order Not Found", description: "The requested order could not be found.", variant: "destructive" });
            router.replace('/admin/orders');
          }
        })
        .catch(err => {
          console.error("Error fetching order details:", err);
          toast({ title: "Error", description: "Failed to load order details.", variant: "destructive" });
        })
        .finally(() => setIsLoading(false));
    } else {
        router.replace('/admin/orders');
    }
  }, [orderId, router, toast]);

  const handleStatusUpdate = async () => {
    if (!orderId || !newStatus || newStatus === order?.status) return;
    setIsUpdatingStatus(true);
    try {
      const success = await updateOrderStatus(orderId, newStatus as OrderStatus);
      if (success) {
        setOrder(prev => prev ? { ...prev, status: newStatus as OrderStatus } : null);
        toast({ title: "Status Updated", description: `Order status changed to ${newStatus}.` });
      } else {
        throw new Error("Failed to update status in backend.");
      }
    } catch (error) {
      toast({ title: "Error", description: "Could not update order status.", variant: "destructive" });
    } finally {
      setIsUpdatingStatus(false);
    }
  };
  
  const getStatusColorClass = (status: OrderStatus) => {
    switch (status) {
      case 'Pending': return 'text-yellow-600 border-yellow-500 bg-yellow-100/60';
      case 'Processing': return 'text-blue-600 border-blue-500 bg-blue-100/60';
      case 'Shipped': return 'text-indigo-600 border-indigo-500 bg-indigo-100/60';
      case 'Delivered': return 'text-green-600 border-green-500 bg-green-100/60';
      case 'Cancelled': return 'text-red-600 border-red-500 bg-red-100/60';
      default: return 'text-gray-600 border-gray-500 bg-gray-100/60';
    }
  };


  if (isLoading) {
    return <div className="flex justify-center items-center min-h-[300px]"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  }

  if (!order) {
    return <p className="text-center text-muted-foreground">Order not found.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/orders"><ChevronLeft className="h-5 w-5" /></Link>
        </Button>
        <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground font-headline">Order #{order.orderId || order.id.substring(0,8)}</h1>
            <p className="text-muted-foreground text-sm">
                Placed on: {format(order.orderDate.toDate(), 'PPpp')}
            </p>
        </div>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6 items-start">
        <div className="md:col-span-2 space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                    <CardTitle className="text-lg flex items-center gap-2"><ShoppingBag className="h-5 w-5 text-primary"/>Items Ordered</CardTitle>
                    <div className={`text-sm font-semibold px-3 py-1 rounded-full border ${getStatusColorClass(order.status)}`}>
                        {order.status}
                    </div>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-3">
                    {order.items.map((item, index) => (
                        <li key={item.productId + index} className="flex gap-3 py-2 border-b last:border-b-0">
                        <Image 
                            src={item.image || '/images/banners/electronics.png'} 
                            alt={item.name} 
                            width={60} 
                            height={60} 
                            className="rounded-md object-cover border"
                            data-ai-hint={item.name.split(' ').slice(0,2).join(' ')}
                        />
                        <div className="flex-grow">
                            <Link href={`/products/item/${item.productId}`} target="_blank" className="font-medium text-sm text-foreground hover:text-primary">{item.name}</Link>
                            <p className="text-xs text-muted-foreground">Qty: {item.quantity} | Price: KES {item.priceAtPurchase.toLocaleString()}</p>
                        </div>
                        <p className="text-sm font-semibold text-foreground">KES {(item.priceAtPurchase * item.quantity).toLocaleString()}</p>
                        </li>
                    ))}
                    </ul>
                    <Separator className="my-4" />
                     <div className="flex justify-end items-center text-lg font-bold">
                        Total: <span className="ml-2 text-primary">KES {order.totalAmount.toLocaleString()}</span>
                    </div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader><CardTitle className="text-lg flex items-center gap-2"><CreditCard className="h-5 w-5 text-primary"/>Payment &amp; Order Notes</CardTitle></CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">Payment Status: Paid (Details TBD)</p>
                    <p className="text-sm text-muted-foreground mt-1">Payment Method: M-Pesa (Details TBD)</p>
                    {/* Add order notes section here if needed */}
                </CardContent>
            </Card>
        </div>
        <div className="md:col-span-1 space-y-6">
            <Card>
                <CardHeader><CardTitle className="text-lg flex items-center gap-2"><UserIcon className="h-5 w-5 text-primary"/>Customer Details</CardTitle></CardHeader>
                <CardContent className="text-sm space-y-1">
                    <p className="font-medium">{order.shippingAddress.name || `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`.trim()}</p>
                    <p className="text-muted-foreground">{order.userEmail || 'No email provided'}</p>
                    <p className="text-muted-foreground">{order.shippingAddress.phone}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader><CardTitle className="text-lg flex items-center gap-2"><MapPin className="h-5 w-5 text-primary"/>Shipping Address</CardTitle></CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-0.5">
                    <p>{order.shippingAddress.name || `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`.trim()}</p>
                    <p>{order.shippingAddress.addressLine1}</p>
                    {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                    <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                    <p>{order.shippingAddress.country || 'Kenya'}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Edit className="h-5 w-5 text-primary"/>Update Order Status</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                    <Select value={newStatus} onValueChange={(value) => setNewStatus(value as OrderStatus)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select new status" />
                        </SelectTrigger>
                        <SelectContent>
                            {orderStatuses.map(status => (
                                <SelectItem key={status} value={status}>{status}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button onClick={handleStatusUpdate} disabled={isUpdatingStatus || newStatus === order.status || !newStatus} className="w-full">
                        {isUpdatingStatus && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Update Status
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
