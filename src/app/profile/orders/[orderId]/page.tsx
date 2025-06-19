
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
import type { Order, OrderItem, OrderStatus } from '@/services/orderService'; 
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
      router.push(`/login?redirect=/profile/orders/${orderId || ''}`); 
      return;
    }
    if (user && orderId) {
      document.title = `Order Details - Creme Collections`; 
      setIsLoading(true);
      getOrderDetails(orderId, user.uid) 
        .then(fetchedOrder => {
          if (fetchedOrder) {
            setOrder(fetchedOrder);
            document.title = `Order #${fetchedOrder.orderId || fetchedOrder.id.substring(0,8)} - Creme Collections`;
          } else {
            toast({ title: "Order Not Found", description: "The requested order could not be found or you do not have permission to view it.", variant: "destructive" });
            router.replace('/profile?section=orders');
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
        router.push('/profile?section=orders');
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
        <AlertCircle className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-destructive mb-3 sm:mb-4" />
        <h1 className="text-xl sm:text-2xl font-semibold mb-1 sm:mb-2">Order Not Found</h1>
        <p className="text-muted-foreground mb-4 sm:mb-6 text-sm sm:text-base">We couldn't find the details for this order.</p>
        <Button asChild variant="outline">
          <Link href="/profile?section=orders">
             <ChevronLeft className="mr-2 h-4 w-4 inline-block" /> Back to My Orders
          </Link>
        </Button>
      </div>
    );
  }
  
  const getStatusColor = (status: OrderStatus) => { 
    switch (status) {
      case 'Pending': return 'text-yellow-600 bg-yellow-100/80 border-yellow-500/80';
      case 'Processing': return 'text-blue-600 bg-blue-100/80 border-blue-500/80';
      case 'Shipped': return 'text-indigo-600 bg-indigo-100/80 border-indigo-500/80';
      case 'Delivered': return 'text-green-600 bg-green-100/80 border-green-500/80';
      case 'Cancelled': return 'text-red-600 bg-red-100/80 border-red-500/80';
      default: return 'text-gray-600 bg-gray-100/80 border-gray-500/80';
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="mb-6 md:mb-8">
        <Button asChild variant="outline" size="sm">
          <Link href="/profile?section=orders">
            <ChevronLeft className="mr-2 h-4 w-4 inline-block" />
            Back to My Orders
          </Link>
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader className="p-4 md:p-6 pb-3 md:pb-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
            <div>
              <CardTitle className="text-xl sm:text-2xl font-headline text-primary">Order Details</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Order ID: {order.orderId || order.id}</CardDescription>
            </div>
            <div className={`text-xs sm:text-sm font-semibold px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full border self-start sm:self-center ${getStatusColor(order.status)}`}>
                Status: {order.status}
            </div>
          </div>
           <p className="text-xs sm:text-sm text-muted-foreground pt-1 sm:pt-2">
            Date Placed: {order.orderDate ? format(order.orderDate.toDate(), 'PPpp') : 'N/A'}
          </p>
        </CardHeader>

        <CardContent className="p-4 md:p-6 space-y-6 md:space-y-8">
          <section>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2"><ShoppingBag className="h-5 w-5 text-primary" />Items Ordered ({order.items.length})</h2>
            <ul className="space-y-3 md:space-y-4">
              {order.items.map((item, index) => (
                <li key={item.productId + index} className="flex flex-col sm:flex-row gap-3 md:gap-4 p-3 md:p-4 border rounded-md bg-muted/20">
                  <Image 
                    src={item.image || '/images/banners/electronics.png'} 
                    alt={item.name} 
                    width={70} 
                    height={70} 
                    className="rounded-md object-cover border flex-shrink-0 w-16 h-16 sm:w-[70px] sm:h-[70px]"
                    data-ai-hint={item.name.split(' ').slice(0,2).join(' ').toLowerCase()} 
                  />
                  <div className="flex-grow">
                    <Link href={`/products/item/${item.productId}`} className="font-medium text-sm sm:text-base text-foreground hover:text-primary transition-colors">{item.name}</Link>
                    <p className="text-xs sm:text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">Price per item: KES {item.priceAtPurchase.toLocaleString()}</p>
                  </div>
                  <p className="text-sm sm:text-md font-semibold text-foreground sm:text-right shrink-0 self-start sm:self-center">KES {(item.priceAtPurchase * item.quantity).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          </section>

          <Separator />

          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
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
                  <span className="font-medium text-foreground">KES {order.totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping:</span>
                  <span className="font-medium text-foreground">{order.totalAmount > 10000 ? 'Free' : 'KES 500'}</span> 
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Taxes (Est.):</span>
                  <span className="font-medium text-foreground">KES {(order.totalAmount * 0.16).toLocaleString(undefined, {maximumFractionDigits: 0})}</span> 
                </div>
                <Separator className="my-2"/>
                <div className="flex justify-between text-base md:text-lg font-bold">
                  <span className="text-foreground">Total Paid:</span>
                  <span className="text-primary">KES {(order.totalAmount + (order.totalAmount > 10000 ? 0 : 500) + (order.totalAmount * 0.16)).toLocaleString(undefined, {maximumFractionDigits:0})}</span>
                </div>
              </div>
            </section>
          </div>
          
          <Separator />

          <div className="text-center space-x-2">
             <Button variant="outline" size="sm" disabled>Track Package (Coming Soon)</Button>
             {order.status === 'Delivered' && <Button variant="secondary" size="sm" disabled>Request Return (Coming Soon)</Button>}
             <Button asChild variant="default" size="sm">
                <Link href={`/contact?subject=Regarding Order #${order.orderId || order.id.substring(0,8)}`}>Contact Support</Link>
             </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
