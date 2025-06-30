
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Trash2, Plus, Minus, ChevronLeft } from 'lucide-react';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/context/CartContext'; 

export default function CartPage() {
  const { cartItems, updateItemQuantity, removeItemFromCart, getCartTotal } = useCart();

  useEffect(() => {
    document.title = 'Shopping Cart - Creme Collections';
  }, []);

  const handleQuantityChange = (id: string, newQuantity: number) => { 
    if (newQuantity < 1) {
        removeItemFromCart(id); 
    } else {
        updateItemQuantity(id, newQuantity);
    }
  };

  const subtotal = getCartTotal();
  const shippingCost = subtotal > 10000 ? 0 : 500; 
  const total = subtotal + shippingCost;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 md:mb-10 gap-4">
        <Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
          <Link href="/products">
            <ChevronLeft className="mr-2 h-4 w-4 inline-block" />
            Continue Shopping
          </Link>
        </Button>
        <div className="text-center">
          <ShoppingCart className="mx-auto h-8 w-8 sm:h-10 sm:w-10 text-primary mb-1 sm:mb-2" />
          <h1 className="text-2xl sm:text-3xl font-bold text-primary font-headline">Your Cart</h1>
        </div>
        <div className="w-full sm:w-[180px]"></div> {/* Spacer for alignment, adjusted for mobile */}
      </div>

      {cartItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-start">
          <div className="md:col-span-2 space-y-6">
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
                    <Link href={`/products/item/${item.id}`}>
                        <h2 className="text-lg font-semibold text-foreground hover:text-primary transition-colors">{item.name}</h2>
                    </Link>
                    <p className="text-md font-medium text-primary mt-1">KES {(item.fixedOfferPrice || 0).toLocaleString()}</p>
                  </div>
                  <div className="flex flex-col items-start sm:items-end gap-3 mt-2 sm:mt-0 w-full sm:w-auto">
                    <div className="flex items-center border rounded-md">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-muted" onClick={() => handleQuantityChange(item.id, item.quantity - 1)} aria-label="Decrease quantity">
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => {
                            const newQuantity = parseInt(e.target.value);
                            if (!isNaN(newQuantity) && newQuantity >= 0) {
                                handleQuantityChange(item.id, newQuantity);
                            } else if (e.target.value === "") {
                                handleQuantityChange(item.id, 0);
                            }
                        }}
                        className="h-8 w-12 text-center border-0 focus-visible:ring-0 bg-transparent font-medium"
                        aria-label="Quantity"
                        min="0"
                      />
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-muted" onClick={() => handleQuantityChange(item.id, item.quantity + 1)} aria-label="Increase quantity">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button variant="ghost" size="sm" className="text-xs text-destructive hover:text-destructive/80 hover:bg-destructive/10 self-end sm:self-auto" onClick={() => removeItemFromCart(item.id)}>
                      <Trash2 className="h-3.5 w-3.5 mr-1" /> Remove
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="md:col-span-1">
            <Card className="shadow-lg sticky top-24">
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
                <Button asChild size="lg" className="w-full">
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
          <ShoppingCart className="mx-auto h-16 w-16 sm:h-20 sm:w-20 text-muted-foreground/30 mb-4 sm:mb-6" />
          <p className="text-lg sm:text-xl font-semibold text-foreground mb-2">Your cart is currently empty.</p>
          <p className="text-muted-foreground mb-4 sm:mb-6">
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
