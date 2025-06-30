
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { CartItem } from "@/context/CartContext";
import Image from 'next/image';

interface OrderSummaryProps {
    cartItems: CartItem[];
    subtotal: number;
    shipping: number;
    total: number;
}

export default function OrderSummary({ cartItems, subtotal, shipping, total }: OrderSummaryProps) {
  return (
    <Card className="shadow-lg sticky top-24"> 
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="text-lg md:text-xl font-semibold text-foreground font-headline">Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6 space-y-4">
        <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
            {cartItems.map(item => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 md:gap-3 overflow-hidden">
                        <Image src={item.image} alt={item.name} width={48} height={48} className="rounded border object-cover flex-shrink-0" data-ai-hint="product item" />
                        <div>
                            <p className="font-medium text-foreground text-xs md:text-sm truncate">{item.name}</p>
                            <p className="text-muted-foreground text-xs">Qty: {item.quantity}</p>
                        </div>
                    </div>
                    <span className="text-foreground text-xs md:text-sm font-medium whitespace-nowrap pl-2">KES {((item.fixedOfferPrice || 0) * item.quantity).toLocaleString()}</span>
                </div>
            ))}
        </div>
        <Separator />
        <div className="space-y-1 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span>KES {subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Shipping</span>
            <span>{shipping > 0 ? `KES ${shipping.toLocaleString()}` : 'Free'}</span>
          </div>
        </div>
        <Separator />
        <div className="flex justify-between text-base md:text-lg font-bold text-foreground">
          <span>Total</span>
          <span>KES {total.toLocaleString()}</span>
        </div>
      </CardContent>
    </Card>
  );
}
