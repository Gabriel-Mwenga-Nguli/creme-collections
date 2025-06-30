
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import CheckoutForm, { type CheckoutFormData } from '@/components/features/checkout/CheckoutForm';
import OrderSummary from '@/components/features/checkout/OrderSummary';
import { createOrder } from '@/services/orderService';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const subtotal = getCartTotal();
  const shipping = subtotal > 10000 ? 0 : 500;
  const total = subtotal + shipping;

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push('/login?redirect=/checkout');
    }
  }, [user, isAuthLoading, router]);

  const handleCheckout = async (data: CheckoutFormData) => {
    if (!user) {
        toast({ title: "You must be logged in to checkout.", variant: "destructive" });
        return;
    }
    setIsProcessing(true);
    
    const orderItems = cartItems.map(item => ({
        productId: item.id,
        name: item.name,
        quantity: item.quantity,
        priceAtPurchase: item.fixedOfferPrice || 0,
        image: item.image,
    }));
    
    const shippingAddress = {
        name: `${data.firstName} ${data.lastName}`,
        ...data
    };

    const newOrderId = await createOrder(user.uid, user.email, orderItems, total, shippingAddress);

    if (newOrderId) {
        toast({
            title: "Order Placed Successfully!",
            description: `Your order #${newOrderId.substring(0,8)} has been confirmed.`,
            duration: 7000,
        });
        clearCart();
        router.push(`/profile/orders/${newOrderId}`);
    } else {
        toast({ title: "Checkout Failed", description: "Could not place your order. Please try again.", variant: "destructive" });
        setIsProcessing(false);
    }
  };

  if (isAuthLoading || !user) {
      return (
          <div className="container mx-auto flex items-center justify-center min-h-[60vh]">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
      )
  }

  if (cartItems.length === 0 && !isProcessing) {
      return (
        <div className="container mx-auto text-center py-20">
             <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground/30 mb-4" />
             <h1 className="text-2xl font-bold">Your Cart is Empty</h1>
             <p className="text-muted-foreground mt-2 mb-6">You need to add items to your cart before you can check out.</p>
             <Button asChild><Link href="/products">Continue Shopping</Link></Button>
        </div>
      )
  }


  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
       <div className="text-center mb-8 md:mb-10">
        <ShoppingBag className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-primary mb-2 sm:mb-4" />
        <h1 className="text-3xl sm:text-4xl font-bold text-primary font-headline">Checkout</h1>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-start">
          <div className="lg:order-2">
             <OrderSummary 
                cartItems={cartItems}
                subtotal={subtotal}
                shipping={shipping}
                total={total}
             />
          </div>
          <div className="lg:order-1">
             <CheckoutForm 
                onCheckout={handleCheckout} 
                isProcessing={isProcessing}
             />
          </div>
      </div>
    </div>
  );
}
