
"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChevronLeft, Package, Home, Truck, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { getOrderDetails, type Order } from '@/services/orderService';
import { notFound } from 'next/navigation';

export default function OrderDetailsPage() {
  const params = useParams<{ orderId: string }>();
  const { orderId } = params;
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      if (orderId && user) {
        setIsLoading(true);
        const fetchedOrder = await getOrderDetails(orderId, user.uid);
        if (fetchedOrder) {
          setOrder(fetchedOrder);
        } else {
            setOrder(null); // Explicitly set to null if not found or no access
        }
        setIsLoading(false);
      } else if (!user) {
          setIsLoading(false); // If no user, stop loading
      }
    }
    fetchOrder();
  }, [orderId, user]);
  
  if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
  }

  if (!order) {
    notFound();
    return null;
  }

  const subtotal = order.items.reduce((acc, item) => acc + item.priceAtPurchase * item.quantity, 0);
  const shipping = 500; // Mock shipping

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon">
            <Link href="/profile/orders"><ChevronLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
            <h1 className="text-2xl font-bold font-headline">Order Details</h1>
            <p className="text-sm text-muted-foreground">Order ID: #{order.orderId || order.id.substring(0,8)} | Placed on {new Date(order.orderDate).toLocaleDateString()}</p>
        </div>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Items Ordered</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.productId} className="flex items-center gap-4">
                <Image src={item.image || 'https://placehold.co/64x64.png'} alt={item.name} width={64} height={64} className="rounded-md border object-cover" data-ai-hint="product item" />
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
      
      <div className="grid md:grid-cols-2 gap-6">
         <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg flex items-center"><Home className="mr-2 h-5 w-5"/> Shipping Address</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-1">
            <p className="font-semibold">{order.shippingAddress.name}</p>
            <p className="text-muted-foreground">{order.shippingAddress.addressLine1}</p>
            <p className="text-muted-foreground">{order.shippingAddress.city}</p>
            <p className="text-muted-foreground">{order.shippingAddress.phone}</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg flex items-center"><Package className="mr-2 h-5 w-5"/> Order Summary</CardTitle>
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
  );
}

