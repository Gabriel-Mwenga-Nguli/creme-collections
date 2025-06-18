
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ShoppingBag, Truck, CreditCard, Lock, ChevronLeft, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCart, type CartItem } from '@/context/CartContext'; 

export default function CheckoutPage() {
  const { toast } = useToast();
  const { cartItems, getCartTotal, clearCart } = useCart(); 

  const [currentStep, setCurrentStep] = useState('shipping');
  const [formData, setFormData] = useState({
    email: '',
    shippingAddress: {
      firstName: '',
      lastName: '',
      address: '',
      apartment: '',
      city: '',
      postalCode: '',
      phone: '',
    },
    deliveryMethod: 'standard', 
    paymentMethod: 'card', 
  });

  useEffect(() => {
    document.title = 'Checkout - Creme Collections';
  }, []);

  const handleInputChange = (section: string, field: string, value: string) => {
    if (section === 'shippingAddress') {
      setFormData(prev => ({
        ...prev,
        shippingAddress: { ...prev.shippingAddress, [field]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };
  
  const handlePlaceOrder = () => {
    console.log("Order placed with data:", { ...formData, cartItems, total: finalTotal });
    toast({
      title: "Order Placed Successfully!",
      description: "Thank you for your purchase. You'll receive a confirmation email shortly.",
      variant: "default",
      duration: 5000,
    });
    clearCart(); 
  };

  const subtotal = getCartTotal();
  const shippingEstimate = formData.deliveryMethod === 'express' ? 1000 : (subtotal > 0 ? 500 : 0); 
  const taxesEstimate = Math.round(subtotal * 0.16); 
  const finalTotal = subtotal + shippingEstimate + taxesEstimate;


  const isShippingComplete = formData.email && formData.shippingAddress.address && formData.shippingAddress.firstName && formData.shippingAddress.lastName && formData.shippingAddress.city && formData.shippingAddress.phone;
  const isDeliveryComplete = !!formData.deliveryMethod;
  const isPaymentComplete = !!formData.paymentMethod;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="flex items-center justify-start mb-6 md:mb-8">
        <Button variant="outline" size="sm" asChild>
          <Link href="/cart">
            <span>
              <ChevronLeft className="mr-2 h-4 w-4 inline-block" />
              Back to Cart
            </span>
          </Link>
        </Button>
      </div>
      <div className="text-center mb-8 md:mb-10">
        <ShoppingBag className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-primary mb-2 sm:mb-4" />
        <h1 className="text-3xl sm:text-4xl font-bold text-primary font-headline">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-start">
        <div className="md:col-span-2 space-y-6 md:space-y-8">
          <Accordion type="single" collapsible defaultValue="shipping" value={currentStep} onValueChange={setCurrentStep} className="w-full">
            <AccordionItem value="shipping">
              <AccordionTrigger className="text-lg md:text-xl font-semibold">
                <div className="flex items-center gap-2 md:gap-3">
                  <Truck className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                  Shipping Address
                  {isShippingComplete && currentStep !== 'shipping' && <CheckCircle className="h-5 w-5 text-green-500 ml-2"/>}
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <Card>
                  <CardContent className="p-4 md:p-6 space-y-4">
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" placeholder="you@example.com" value={formData.email} onChange={(e) => handleInputChange('main', 'email', e.target.value)} required className="text-base md:text-sm" />
                    </div>
                    <Separator/>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" placeholder="Jane" value={formData.shippingAddress.firstName} onChange={(e) => handleInputChange('shippingAddress', 'firstName', e.target.value)} required className="text-base md:text-sm"/>
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" placeholder="Doe" value={formData.shippingAddress.lastName} onChange={(e) => handleInputChange('shippingAddress', 'lastName', e.target.value)} required className="text-base md:text-sm"/>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input id="address" placeholder="123 Main St" value={formData.shippingAddress.address} onChange={(e) => handleInputChange('shippingAddress', 'address', e.target.value)} required className="text-base md:text-sm"/>
                    </div>
                    <div>
                      <Label htmlFor="apartment">Apartment, suite, etc. (Optional)</Label>
                      <Input id="apartment" placeholder="Apt 4B" value={formData.shippingAddress.apartment} onChange={(e) => handleInputChange('shippingAddress', 'apartment', e.target.value)} className="text-base md:text-sm"/>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input id="city" placeholder="Nairobi" value={formData.shippingAddress.city} onChange={(e) => handleInputChange('shippingAddress', 'city', e.target.value)} required className="text-base md:text-sm"/>
                      </div>
                      <div>
                        <Label htmlFor="postalCode">Postal Code</Label>
                        <Input id="postalCode" placeholder="00100" value={formData.shippingAddress.postalCode} onChange={(e) => handleInputChange('shippingAddress', 'postalCode', e.target.value)} required className="text-base md:text-sm"/>
                      </div>
                    </div>
                     <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" type="tel" placeholder="+254 7XX XXX XXX" value={formData.shippingAddress.phone} onChange={(e) => handleInputChange('shippingAddress', 'phone', e.target.value)} required className="text-base md:text-sm"/>
                    </div>
                    <Button onClick={() => {if(isShippingComplete) setCurrentStep('delivery')}} disabled={!isShippingComplete} className="w-full sm:w-auto">Continue to Delivery</Button>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="delivery" disabled={!isShippingComplete}>
              <AccordionTrigger className="text-lg md:text-xl font-semibold">
                <div className="flex items-center gap-2 md:gap-3">
                 <Truck className="h-5 w-5 md:h-6 md:w-6 text-primary" /> 
                  Delivery Method
                  {isDeliveryComplete && currentStep !== 'delivery' && <CheckCircle className="h-5 w-5 text-green-500 ml-2"/>}
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                 <Card>
                    <CardContent className="p-4 md:p-6 space-y-4">
                        <RadioGroup defaultValue="standard" value={formData.deliveryMethod} onValueChange={(value) => handleInputChange('main', 'deliveryMethod', value)}>
                            <Label htmlFor="deliveryStandard" className="flex items-center justify-between p-3 md:p-4 border rounded-md cursor-pointer hover:border-primary has-[input:checked]:border-primary has-[input:checked]:ring-2 has-[input:checked]:ring-primary">
                                <div>
                                    <h3 className="font-medium text-sm md:text-base">Standard Shipping</h3>
                                    <p className="text-xs md:text-sm text-muted-foreground">4-7 business days - KES {subtotal > 0 ? '500' : '0'}</p>
                                </div>
                                <RadioGroupItem value="standard" id="deliveryStandard" />
                            </Label>
                            <Label htmlFor="deliveryExpress" className="flex items-center justify-between p-3 md:p-4 border rounded-md cursor-pointer hover:border-primary has-[input:checked]:border-primary has-[input:checked]:ring-2 has-[input:checked]:ring-primary">
                                <div>
                                    <h3 className="font-medium text-sm md:text-base">Express Shipping</h3>
                                    <p className="text-xs md:text-sm text-muted-foreground">1-2 business days - KES 1,000</p>
                                </div>
                                <RadioGroupItem value="express" id="deliveryExpress" />
                            </Label>
                        </RadioGroup>
                        <Button onClick={() => {if(isDeliveryComplete) setCurrentStep('payment')}} disabled={!isDeliveryComplete} className="w-full sm:w-auto">Continue to Payment</Button>
                    </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="payment" disabled={!isShippingComplete || !isDeliveryComplete}>
              <AccordionTrigger className="text-lg md:text-xl font-semibold">
                <div className="flex items-center gap-2 md:gap-3">
                  <CreditCard className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                  Payment Method
                   {isPaymentComplete && currentStep !== 'payment' && <CheckCircle className="h-5 w-5 text-green-500 ml-2"/>}
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <Card>
                    <CardHeader className="p-4 md:p-6">
                        <CardTitle className="text-base md:text-lg">Payment Details</CardTitle>
                        <CardDescription className="text-xs md:text-sm">All transactions are secure and encrypted.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 md:p-6 space-y-4">
                        <RadioGroup defaultValue="card" value={formData.paymentMethod} onValueChange={(value) => handleInputChange('main', 'paymentMethod', value)}>
                             <Label htmlFor="paymentCard" className="flex items-center p-3 md:p-4 border rounded-md cursor-pointer hover:border-primary has-[input:checked]:border-primary has-[input:checked]:ring-2 has-[input:checked]:ring-primary">
                                <CreditCard className="mr-2 md:mr-3 h-5 w-5 text-muted-foreground" />
                                <span className="font-medium text-sm md:text-base">Credit/Debit Card</span>
                                <RadioGroupItem value="card" id="paymentCard" className="ml-auto" />
                            </Label>
                            <Label htmlFor="paymentMpesa" className="flex items-center p-3 md:p-4 border rounded-md cursor-pointer hover:border-primary has-[input:checked]:border-primary has-[input:checked]:ring-2 has-[input:checked]:ring-primary">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 md:mr-3 text-muted-foreground"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
                                <span className="font-medium text-sm md:text-base">M-Pesa</span>
                                <RadioGroupItem value="mpesa" id="paymentMpesa" className="ml-auto" />
                            </Label>
                        </RadioGroup>

                        {formData.paymentMethod === 'card' && (
                            <div className="space-y-3 pt-2">
                                <div>
                                    <Label htmlFor="cardNumber">Card Number</Label>
                                    <Input id="cardNumber" placeholder="•••• •••• •••• ••••" className="text-base md:text-sm"/>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <Label htmlFor="expiryDate">Expiry Date</Label>
                                        <Input id="expiryDate" placeholder="MM/YY" className="text-base md:text-sm"/>
                                    </div>
                                    <div>
                                        <Label htmlFor="cvc">CVC</Label>
                                        <Input id="cvc" placeholder="•••" className="text-base md:text-sm"/>
                                    </div>
                                </div>
                            </div>
                        )}
                         {formData.paymentMethod === 'mpesa' && (
                            <div className="space-y-3 pt-2">
                                <div>
                                    <Label htmlFor="mpesaPhone">M-Pesa Phone Number</Label>
                                    <Input id="mpesaPhone" placeholder="07XX XXX XXX" className="text-base md:text-sm"/>
                                </div>
                                <p className="text-xs md:text-sm text-muted-foreground">You will receive a prompt on your phone to enter your M-Pesa PIN.</p>
                            </div>
                        )}
                         <Button onClick={() => {if(isPaymentComplete)setCurrentStep('review')}} disabled={!isPaymentComplete} className="w-full sm:w-auto">Review Order</Button>
                    </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
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
                <div className="flex justify-between text-muted-foreground">
                  <span>Taxes (Est.)</span>
                  <span>KES {taxesEstimate.toLocaleString()}</span>
                </div>
              </div>
              <Separator />
              <div className="flex justify-between text-base md:text-lg font-bold text-foreground">
                <span>Total</span>
                <span>KES {finalTotal.toLocaleString()}</span>
              </div>
              {currentStep === 'review' && isShippingComplete && isDeliveryComplete && isPaymentComplete ? (
                <Button size="lg" className="w-full mt-4" onClick={handlePlaceOrder} disabled={cartItems.length === 0}>
                  <Lock className="mr-2 h-5 w-5" /> Place Order
                </Button>
              ) : (
                <Button size="lg" className="w-full mt-4" disabled title={ cartItems.length === 0 ? "Your cart is empty" : "Complete all steps to place order"}>
                  Complete Previous Steps
                </Button>
              )}
              <p className="text-xs text-muted-foreground text-center mt-2">
                By placing your order, you agree to our Terms & Conditions.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
