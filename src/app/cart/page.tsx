
"use client";

import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Trash2, Plus, Minus, X, ChevronLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Metadata for client components needs to be handled differently, e.g. via useEffect
// export const metadata: Metadata = {
//   title: 'Shopping Cart - Creme Lite',
//   description: 'Review items in your shopping cart and proceed to checkout.',
// };

interface CartItem {
  id: number;
  name: string;
  image: string;
  dataAiHint: string;
  price: number;
  quantity: number;
  color?: string;
  size?: string;
}

const initialCartItems: CartItem[] = [
  { id: 401, name: "Modern Desk Lamp", image: "https://placehold.co/100x100.png", dataAiHint: "lamp decor", price: 3500, quantity: 1, color: "Black", size: "Medium" },
  { id: 402, name: "Wireless Bluetooth Keyboard", image: "https://placehold.co/100x100.png", dataAiHint: "keyboard tech", price: 7200, quantity: 2, color: "Silver", size: "Standard" },
  { id: 403, name: "Ergonomic Office Chair", image: "https://placehold.co/100x100.png", dataAiHint: "office furniture", price: 12500, quantity: 1, color: "Gray", size: "Large" },
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);

  useEffect(() => {
    document.title = 'Shopping Cart - Creme Lite';
  }, []);

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return; // Minimum quantity is 1
    setCartItems(items => items.map(item => item.id === id ? { ...item, quantity: newQuantity } : item));
  };

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingCost = subtotal > 10000 ? 0 : 500; // Free shipping over KES 10,000
  const total = subtotal + shippingCost;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="flex items-center justify-between mb-10">
        <Button variant="outline" size="sm" asChild>
          <Link href="/products">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Continue Shopping
          </Link>
        </Button>
        <div className="text-center">
          <ShoppingCart className="mx-auto h-10 w-10 text-primary mb-2" />
          <h1 className="text-3xl font-bold text-primary font-headline">Your Cart</h1>
        </div>
        <div className="w-[180px]"></div> {/* Spacer for alignment */}
      </div>

      {cartItems.length > 0 ? (
        <div className="grid lg:grid-cols-3 gap-8 md:gap-12 items-start">
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <Card key={item.id} className="overflow-hidden shadow-md">
                <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 items-start">
                  <Image 
                    src={item.image} 
                    alt={item.name} 
                    width={100} 
                    height={100} 
                    className="rounded-md object-cover w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 border"
                    data-ai-hint={item.dataAiHint}
                  />
                  <div className="flex-grow">
                    <Link href={`/products/item/product-${item.id}`}>
                        <h2 className="text-lg font-semibold text-foreground hover:text-primary transition-colors">{item.name}</h2>
                    </Link>
                    {item.color && <p className="text-sm text-muted-foreground">Color: {item.color}</p>}
                    {item.size && <p className="text-sm text-muted-foreground">Size: {item.size}</p>}
                    <p className="text-md font-medium text-primary mt-1">KES {item.price.toLocaleString()}</p>
                  </div>
                  <div className="flex flex-col items-end gap-3 mt-2 sm:mt-0 w-full sm:w-auto">
                    <div className="flex items-center border rounded-md">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-muted" onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label="Decrease quantity">
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                        className="h-8 w-12 text-center border-0 focus-visible:ring-0 bg-transparent font-medium"
                        aria-label="Quantity"
                        min="1"
                      />
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-muted" onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label="Increase quantity">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button variant="ghost" size="sm" className="text-xs text-destructive hover:text-destructive/80 hover:bg-destructive/10" onClick={() => removeItem(item.id)}>
                      <Trash2 className="h-3.5 w-3.5 mr-1" /> Remove
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="lg:col-span-1">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-foreground font-headline">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>KES {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span>{shippingCost > 0 ? `KES ${shippingCost.toLocaleString()}` : 'Free'}</span>
                  </div>
                </div>
                <Separator />
                <div className="flex justify-between text-xl font-bold text-foreground">
                  <span>Total</span>
                  <span>KES {total.toLocaleString()}</span>
                </div>
                <Button size="lg" className="w-full" asChild>
                  <Link href="/checkout">
                    Proceed to Checkout
                  </Link>
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Shipping and taxes calculated at checkout.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="text-center py-16">
          <ShoppingCart className="mx-auto h-20 w-20 text-muted-foreground/30 mb-6" />
          <p className="text-xl font-semibold text-foreground mb-2">Your cart is currently empty.</p>
          <p className="text-muted-foreground mb-6">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Button asChild size="lg">
            <Link href="/products">Start Shopping</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
