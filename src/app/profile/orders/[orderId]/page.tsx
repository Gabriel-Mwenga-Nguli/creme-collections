
"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Loader2, ChevronLeft, ShoppingBag, MapPin, Package, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import type { Order, OrderItem } from '@/services/orderService';
import { getOrderDetails } from '@/services/orderService';
import { format } from 'date-fns';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [user, authLoading] = useAuthState(auth);
  
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const orderId = typeof params.orderId === 'string' ? params.orderId : null;

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/login?redirect=/profile/orders'); // Redirect if not logged in
      return;
    }
    if (user && orderId) {
      document.title = `Order ${orderId} - Creme Collections`;
      setIsLoading(true);
      getOrderDetails(user.uid, orderId)
        .then(fetchedOrder => {
          if (fetchedOrder) {
            setOrder(fetchedOrder);
          } else {
            toast({ title: "Order Not Found", description: "The requested order could not be found.", variant: "destructive" });
            // router.push('/profile'); // Or a 404 page
          }
        })
        .catch(err => {
          console.error("Error fetching order details:", err);
          toast({ title: "Error", description: "Failed to load order details.", variant: "destructive" });
        })
        .finally(() => setIsLoading(false));
    } else if (!orderId) {
        toast({ title: "Error", description: "Order ID is missing.", variant: "destructive" });
        setIsLoading(false);
        router.push('/profile');
    }
  }, [user, authLoading, orderId, router, toast]);

  if (authLoading || isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 text-center">
        <AlertCircle className="mx-auto h-16 w-16 text-destructive mb-4" />
        <h1 className="text-2xl font-semibold mb-2">Order Not Found</h1>
        <p className="text-muted-foreground mb-6">We couldn't find the details for this order. It might have been removed or the ID is incorrect.</p>
        <Button asChild variant="outline">
          <Link href="/profile?section=orders">
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to My Orders
          </Link>
        </Button>
      </div>
    );
  }
  
  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'Pending': return 'text-yellow-600 bg-yellow-100 border-yellow-500';
      case 'Processing': return 'text-blue-600 bg-blue-100 border-blue-500';
      case 'Shipped': return 'text-indigo-600 bg-indigo-100 border-indigo-500';
      case 'Delivered': return 'text-green-600 bg-green-100 border-green-500';
      case 'Cancelled': return 'text-red-600 bg-red-100 border-red-500';
      default: return 'text-gray-600 bg-gray-100 border-gray-500';
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="mb-8">
        <Button variant="outline" size="sm" asChild>
          <Link href="/profile?section=orders">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to My Orders
          </Link>
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
            <div>
              <CardTitle className="text-2xl font-headline text-primary">Order Details</CardTitle>
              <CardDescription>Order ID: {order.orderId || order.id}</CardDescription>
            </div>
            <div className={`text-sm font-semibold px-3 py-1.5 rounded-full border ${getStatusColor(order.status)}`}>
                Status: {order.status}
            </div>
          </div>
           <p className="text-sm text-muted-foreground pt-2">
            Date Placed: {order.orderDate ? format(order.orderDate.toDate(), 'PPpp') : 'N/A'}
          </p>
        </CardHeader>

        <CardContent className="space-y-8">
          <section>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2"><ShoppingBag className="h-5 w-5 text-primary" />Items Ordered ({order.items.length})</h2>
            <ul className="space-y-4">
              {order.items.map((item, index) => (
                <li key={item.productId + index} className="flex flex-col sm:flex-row gap-4 p-4 border rounded-md bg-muted/20">
                  <Image 
                    src={item.image || 'https://placehold.co/100x100.png'} 
                    alt={item.name} 
                    width={80} 
                    height={80} 
                    className="rounded-md object-cover border flex-shrink-0 w-20 h-20"
                    data-ai-hint="product item" 
                  />
                  <div className="flex-grow">
                    <Link href={`/products/item/${item.productId}`} className="font-medium text-foreground hover:text-primary transition-colors">{item.name}</Link>
                    <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                    <p className="text-sm text-muted-foreground">Price per item: KES {item.priceAtPurchase.toLocaleString()}</p>
                  </div>
                  <p className="text-md font-semibold text-foreground sm:text-right shrink-0">KES {(item.priceAtPurchase * item.quantity).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          </section>

          <Separator />

          <div className="grid md:grid-cols-2 gap-8">
            <section>
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2"><MapPin className="h-5 w-5 text-primary"/>Shipping Address</h2>
              <div className="text-sm text-muted-foreground space-y-0.5">
                <p>{order.shippingAddress.name || `${order.shippingAddress.firstName || ''} ${order.shippingAddress.lastName || ''}`.trim()}</p>
                <p>{order.shippingAddress.addressLine1}</p>
                {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                <p>{order.shippingAddress.country || 'Kenya'}</p>
                <p>Phone: {order.shippingAddress.phone}</p>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2"><Package className="h-5 w-5 text-primary"/>Order Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span className="font-medium text-foreground">KES {order.totalAmount.toLocaleString()}</span> {/* Assuming totalAmount is subtotal */}
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping:</span>
                  <span className="font-medium text-foreground">KES 0</span> {/* Placeholder */}
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Taxes:</span>
                  <span className="font-medium text-foreground">KES 0</span> {/* Placeholder */}
                </div>
                <Separator className="my-2"/>
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-foreground">Total Paid:</span>
                  <span className="text-primary">KES {order.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </section>
          </div>
          
          <Separator />

          <div className="text-center space-x-2">
             {/* Future actions like "Track Package", "Request Return", "Reorder" can go here */}
             <Button variant="outline">Track Package (Coming Soon)</Button>
             {order.status === 'Delivered' && <Button variant="secondary">Request Return (Coming Soon)</Button>}
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
