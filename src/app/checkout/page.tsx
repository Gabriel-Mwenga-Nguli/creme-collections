
"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag, ChevronLeft, MessageSquare } from 'lucide-react';
import { useCart } from '@/context/CartContext'; 

export default function CheckoutPage() {
  const { cartItems, getCartTotal } = useCart(); 

  useEffect(() => {
    document.title = 'Complete Your Order - Creme Collections';
  }, []);

  const subtotal = getCartTotal();
  const shippingEstimate = subtotal > 10000 ? 0 : 500; 
  const finalTotal = subtotal + shippingEstimate;

  const handleWhatsAppCheckout = () => {
    const itemDetails = cartItems
      .map(item => 
        `${item.name} (x${item.quantity}) - KES ${((item.fixedOfferPrice || 0) * item.quantity).toLocaleString()}`
      )
      .join('\n');
    const message = `Hello Creme Collections! I'd like to place an order for the following items:\n\n${itemDetails}\n\nSubtotal: KES ${subtotal.toLocaleString()}\nShipping: KES ${shippingEstimate.toLocaleString()}\nTotal: KES ${finalTotal.toLocaleString()}\n\nPlease advise on payment and delivery.`;
    
    const whatsappNumber = "254742468070";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="flex items-center justify-start mb-6 md:mb-8">
        <Link href="/cart" passHref legacyBehavior>
          <Button as="a" variant="outline" size="sm">
            <span>
              <ChevronLeft className="mr-2 h-4 w-4 inline-block" />
              Back to Cart
            </span>
          </Button>
        </Link>
      </div>
      <div className="text-center mb-8 md:mb-10">
        <ShoppingBag className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-primary mb-2 sm:mb-4" />
        <h1 className="text-3xl sm:text-4xl font-bold text-primary font-headline">Finalize Your Order</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-start">
        <div className="md:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl font-semibold">How to Complete Your Order</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                    <p>To finalize your purchase, please contact us directly via WhatsApp. We will process your order and arrange payment and delivery with you.</p>
                    <p>Click the "Checkout with WhatsApp" button to automatically generate a message with your order details.</p>
                     <Button 
                        size="lg" 
                        className="w-full bg-green-600 hover:bg-green-700 text-white mt-4" 
                        onClick={handleWhatsAppCheckout}
                        disabled={cartItems.length === 0}
                    >
                        <MessageSquare className="mr-2 h-5 w-5" />
                        Checkout with WhatsApp
                    </Button>
                    <p className="text-xs text-center mt-2">Our team will respond promptly to confirm your order.</p>
                </CardContent>
            </Card>
        </div>

        <div className="md:col-span-1">
          <Card className="shadow-lg sticky top-24"> 
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-lg md:text-xl font-semibold text-foreground font-headline">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6 space-y-4">
              {cartItems.length === 0 && <p className="text-sm text-muted-foreground">Your cart is empty.</p>}
              {cartItems.map(item => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 md:gap-3">
                        <Image src={item.image} alt={item.name} width={40} height={40} className="rounded border object-cover" data-ai-hint="product item" />
                        <div>
                            <p className="font-medium text-foreground text-xs md:text-sm">{item.name} (x{item.quantity})</p>
                        </div>
                    </div>
                    <span className="text-foreground text-xs md:text-sm">KES {((item.fixedOfferPrice || 0) * item.quantity).toLocaleString()}</span>
                </div>
              ))}
              <Separator />
              <div className="space-y-1 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>KES {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>KES {shippingEstimate.toLocaleString()}</span>
                </div>
              </div>
              <Separator />
              <div className="flex justify-between text-base md:text-lg font-bold text-foreground">
                <span>Total</span>
                <span>KES {finalTotal.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
