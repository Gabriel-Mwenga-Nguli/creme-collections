"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChevronLeft, Package, User, Truck, DollarSign, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { getOrderDetails, type Order } from '@/services/orderService';
import { notFound } from 'next/navigation';

export default function AdminOrderDetailsPage({ params }: { params: { orderId: string }}) {
  const { orderId } = params;
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
      if (!orderId) return;
      async function fetchOrder() {
          setIsLoading(true);
          const fetchedOrder = await getOrderDetails(orderId);
          setOrder(fetchedOrder);
          setIsLoading(false);
      }
      fetchOrder();
  }, [orderId]);
  
  if (isLoading) {
      return (
          <div className="flex items-center justify-center h-96">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
      );
  }
  
  if (!order) {
    return notFound();
  }

  const subtotal = order.items.reduce((acc, item) => acc + item.priceAtPurchase * item.quantity, 0);
  const shipping = 500; // Mock shipping

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon">
            <Link href="/admin/orders"><ChevronLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
            <h1 className="text-2xl font-bold font-headline">Order Details</h1>
            <p className="text-sm text-muted-foreground">Order ID: #{order.orderId || order.id.substring(0,8)} | Placed on {new Date(order.orderDate).toLocaleDateString()}</p>
        </div>
      </div>
      
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                <CardTitle className='flex items-center gap-2'><Package className='w-5 h-5'/>Items Ordered</CardTitle>
                </CardHeader>
                <CardContent>
                <div className="space-y-4">
                    {order.items.map((item) => (
                    <div key={item.productId} className="flex items-center gap-4">
                        <Image src={item.image || 'https://placehold.co/64x64.png'} alt={item.name} width={64} height={64} className="rounded-md border object-cover" data-ai-hint={'product item'} />
                        <div className="flex-grow">
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium">KES {(item.priceAtPurchase * item.quantity).toLocaleString()}</p>
                    </div>
                    ))}
                </div>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle className='flex items-center gap-2'><DollarSign className='w-5 h-5'/>Payment Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Payment Method</span>
                        <span className="font-medium">M-PESA (Mock)</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="text-muted-foreground">Payment Status</span>
                        <Badge variant={'default'}>Paid</Badge>
                    </div>
                     <div className="flex justify-between">
                        <span className="text-muted-foreground">Transaction ID</span>
                        <span className="font-mono text-xs">SGF8723YHJ (Mock)</span>
                    </div>
                </CardContent>
            </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className='flex items-center gap-2'><User className='w-5 h-5'/>Customer</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-1">
                    <p className="font-semibold">{order.shippingAddress.name}</p>
                    <p className="text-muted-foreground">{order.userEmail}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className='flex items-center gap-2'><Truck className='w-5 h-5'/>Shipping Address</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-1">
                    <p className="font-semibold">{order.shippingAddress.name}</p>
                    <p className="text-muted-foreground">{order.shippingAddress.addressLine1}</p>
                    <p className="text-muted-foreground">{order.shippingAddress.city}</p>
                    <p className="text-muted-foreground">{order.shippingAddress.phone}</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle className='flex items-center gap-2'><Package className='w-5 h-5'/>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>KES {subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>KES {shipping.toLocaleString()}</span>
                    </div>
                    <Separator/>
                    <div className="flex justify-between font-bold text-base">
                    <span>Total</span>
                    <span>KES {order.totalAmount.toLocaleString()}</span>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
