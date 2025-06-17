
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Trash2, Plus, Minus, X } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Shopping Cart - Creme Lite',
  description: 'Review items in your shopping cart and proceed to checkout.',
};

// Dummy data for cart items
const cartItems = [
  { id: 401, name: "Modern Desk Lamp", image: "https://placehold.co/100x100.png", dataAiHint: "lamp decor", price: 3500, quantity: 1, color: "Black", size: "Medium" },
  { id: 402, name: "Wireless Bluetooth Keyboard", image: "https://placehold.co/100x100.png", dataAiHint: "keyboard tech", price: 7200, quantity: 1, color: "Silver", size: "Standard" },
];

const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
const shippingCost = subtotal > 5000 ? 0 : 300; // Free shipping over KES 5000
const total = subtotal + shippingCost;

export default function CartPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="text-center mb-10">
        <ShoppingCart className="mx-auto h-12 w-12 text-primary mb-4" />
        <h1 className="text-4xl font-bold text-primary font-headline">Your Shopping Cart</h1>
      </div>

      {cartItems.length > 0 ? (
        <div className="grid lg:grid-cols-3 gap-8 md:gap-12 items-start">
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-card p-4 sm:p-6 rounded-lg shadow-md flex flex-col sm:flex-row gap-4 items-start">
                <Image 
                  src={item.image} 
                  alt={item.name} 
                  width={100} 
                  height={100} 
                  className="rounded-md object-cover w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0"
                  data-ai-hint={item.dataAiHint}
                />
                <div className="flex-grow">
                  <h2 className="text-lg font-semibold text-foreground">{item.name}</h2>
                  {item.color && <p className="text-sm text-muted-foreground">Color: {item.color}</p>}
                  {item.size && <p className="text-sm text-muted-foreground">Size: {item.size}</p>}
                  <p className="text-md font-medium text-primary mt-1">KES {item.price.toLocaleString()}</p>
                </div>
                <div className="flex flex-col items-end gap-2 mt-2 sm:mt-0">
                  <div className="flex items-center border rounded-md">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-muted">
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      value={item.quantity}
                      readOnly
                      className="h-8 w-12 text-center border-0 focus-visible:ring-0 bg-transparent"
                      aria-label="Quantity"
                    />
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-muted">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive/80 text-xs">
                    <Trash2 className="h-3.5 w-3.5 mr-1" /> Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1 bg-card p-6 rounded-lg shadow-md space-y-6">
            <h2 className="text-xl font-semibold text-foreground font-headline">Order Summary</h2>
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
            <Button size="lg" className="w-full">
              Proceed to Checkout
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Shipping and taxes calculated at checkout.
            </p>
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
