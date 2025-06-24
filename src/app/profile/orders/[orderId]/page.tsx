
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChevronLeft, Package, Home, User, Truck } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

const mockOrder = {
  id: 'ORD746352',
  date: 'June 20, 2024',
  status: 'Delivered',
  total: 15498,
  shippingAddress: {
    name: 'Jane Doe',
    addressLine1: '123 Riverside Drive, Apt 4B',
    city: 'Nairobi',
    phone: '+254 712 345678',
  },
  items: [
    {
      id: '1',
      name: 'Modern Smartwatch Series X',
      image: '/images/products/smartwatch_main.png',
      price: 12999,
      quantity: 1,
    },
    {
      id: '2',
      name: 'Classic Men\'s Polo Shirt',
      image: '/images/products/polo_shirt_blue.png',
      price: 2499,
      quantity: 1,
    },
  ],
  payment: {
    method: 'M-PESA',
    status: 'Paid',
  },
};


export default function OrderDetailsPage({ params }: { params: { orderId: string }}) {
  const order = mockOrder; // In a real app, fetch order by params.orderId
  
  if (!order) {
    return <p>Order not found.</p>;
  }

  const subtotal = order.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = 500; // Mock shipping

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon">
            <Link href="/profile/orders"><ChevronLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
            <h1 className="text-2xl font-bold font-headline">Order Details</h1>
            <p className="text-sm text-muted-foreground">Order ID: {order.id} | Placed on {order.date}</p>
        </div>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Items Ordered</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <Image src={item.image} alt={item.name} width={64} height={64} className="rounded-md border object-cover" />
                <div className="flex-grow">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <p className="font-medium">KES {(item.price * item.quantity).toLocaleString()}</p>
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
              <span>KES {order.total.toLocaleString()}</span>
            </div>
             <Separator/>
             <div className="flex justify-between pt-1">
                 <span className="text-muted-foreground">Payment Method</span>
                 <span className="font-medium">{order.payment.method}</span>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
