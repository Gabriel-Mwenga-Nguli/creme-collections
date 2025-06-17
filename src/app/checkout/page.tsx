
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

interface CartItem {
  id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
  color?: string;
  size?: string;
}

// Dummy cart data for summary - in a real app, this would come from cart state/context
const dummyCartItems: CartItem[] = [
  { id: 401, name: "Modern Desk Lamp", image: "https://placehold.co/80x80.png", price: 3500, quantity: 1 },
  { id: 402, name: "Wireless Keyboard", image: "https://placehold.co/80x80.png", price: 7200, quantity: 2 },
];

const subtotal = dummyCartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
const shippingEstimate = 500;
const taxesEstimate = Math.round(subtotal * 0.16); // Example 16% VAT
const total = subtotal + shippingEstimate + taxesEstimate;

export default function CheckoutPage() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState('shipping'); // 'shipping', 'delivery', 'payment', 'review'
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
    deliveryMethod: 'standard', // 'standard', 'express'
    paymentMethod: 'card', // 'card', 'mpesa'
  });

  useEffect(() => {
    document.title = 'Checkout - Creme Lite';
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
    console.log("Order placed with data:", formData);
    // Add validation here before showing toast
    toast({
      title: "Order Placed Successfully!",
      description: "Thank you for your purchase. You'll receive a confirmation email shortly.",
      variant: "default",
      duration: 5000,
    });
    // Potentially redirect to an order confirmation page or clear cart
    // For now, just log and show toast.
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="flex items-center justify-start mb-8">
        <Button variant="outline" size="sm" asChild>
          <Link href="/cart">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Cart
          </Link>
        </Button>
      </div>
      <div className="text-center mb-10">
        <ShoppingBag className="mx-auto h-12 w-12 text-primary mb-4" />
        <h1 className="text-4xl font-bold text-primary font-headline">Checkout</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 md:gap-12 items-start">
        {/* Checkout Steps Forms */}
        <div className="lg:col-span-2 space-y-8">
          <Accordion type="single" collapsible defaultValue="shipping" value={currentStep} onValueChange={setCurrentStep} className="w-full">
            {/* Shipping Address */}
            <AccordionItem value="shipping">
              <AccordionTrigger className="text-xl font-semibold">
                <div className="flex items-center gap-3">
                  <Truck className="h-6 w-6 text-primary" />
                  Shipping Address
                  {formData.email && formData.shippingAddress.address && currentStep !== 'shipping' && <CheckCircle className="h-5 w-5 text-green-500 ml-2"/>}
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" placeholder="you@example.com" value={formData.email} onChange={(e) => handleInputChange('main', 'email', e.target.value)} required />
                    </div>
                    <Separator/>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" placeholder="Jane" value={formData.shippingAddress.firstName} onChange={(e) => handleInputChange('shippingAddress', 'firstName', e.target.value)} required/>
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" placeholder="Doe" value={formData.shippingAddress.lastName} onChange={(e) => handleInputChange('shippingAddress', 'lastName', e.target.value)} required/>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input id="address" placeholder="123 Main St" value={formData.shippingAddress.address} onChange={(e) => handleInputChange('shippingAddress', 'address', e.target.value)} required/>
                    </div>
                    <div>
                      <Label htmlFor="apartment">Apartment, suite, etc. (Optional)</Label>
                      <Input id="apartment" placeholder="Apt 4B" value={formData.shippingAddress.apartment} onChange={(e) => handleInputChange('shippingAddress', 'apartment', e.target.value)} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input id="city" placeholder="Nairobi" value={formData.shippingAddress.city} onChange={(e) => handleInputChange('shippingAddress', 'city', e.target.value)} required/>
                      </div>
                      <div>
                        <Label htmlFor="postalCode">Postal Code</Label>
                        <Input id="postalCode" placeholder="00100" value={formData.shippingAddress.postalCode} onChange={(e) => handleInputChange('shippingAddress', 'postalCode', e.target.value)} required/>
                      </div>
                    </div>
                     <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" type="tel" placeholder="+254 7XX XXX XXX" value={formData.shippingAddress.phone} onChange={(e) => handleInputChange('shippingAddress', 'phone', e.target.value)} required />
                    </div>
                    <Button onClick={() => setCurrentStep('delivery')} className="w-full sm:w-auto">Continue to Delivery</Button>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Delivery Method */}
            <AccordionItem value="delivery">
              <AccordionTrigger className="text-xl font-semibold">
                <div className="flex items-center gap-3">
                 <Truck className="h-6 w-6 text-primary" /> {/* Changed icon */}
                  Delivery Method
                  {currentStep !== 'delivery' && <CheckCircle className="h-5 w-5 text-green-500 ml-2"/>}
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                 <Card>
                    <CardContent className="p-6 space-y-4">
                        <RadioGroup defaultValue="standard" value={formData.deliveryMethod} onValueChange={(value) => handleInputChange('main', 'deliveryMethod', value)}>
                            <Label htmlFor="deliveryStandard" className="flex items-center justify-between p-4 border rounded-md cursor-pointer hover:border-primary has-[input:checked]:border-primary has-[input:checked]:ring-2 has-[input:checked]:ring-primary">
                                <div>
                                    <h3 className="font-medium">Standard Shipping</h3>
                                    <p className="text-sm text-muted-foreground">4-7 business days - KES {shippingEstimate.toLocaleString()}</p>
                                </div>
                                <RadioGroupItem value="standard" id="deliveryStandard" />
                            </Label>
                            <Label htmlFor="deliveryExpress" className="flex items-center justify-between p-4 border rounded-md cursor-pointer hover:border-primary has-[input:checked]:border-primary has-[input:checked]:ring-2 has-[input:checked]:ring-primary">
                                <div>
                                    <h3 className="font-medium">Express Shipping</h3>
                                    <p className="text-sm text-muted-foreground">1-2 business days - KES {(shippingEstimate * 2).toLocaleString()}</p>
                                </div>
                                <RadioGroupItem value="express" id="deliveryExpress" />
                            </Label>
                        </RadioGroup>
                        <Button onClick={() => setCurrentStep('payment')} className="w-full sm:w-auto">Continue to Payment</Button>
                    </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Payment Method */}
            <AccordionItem value="payment">
              <AccordionTrigger className="text-xl font-semibold">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-6 w-6 text-primary" />
                  Payment Method
                  {currentStep !== 'payment' && <CheckCircle className="h-5 w-5 text-green-500 ml-2"/>}
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Payment Details</CardTitle>
                        <CardDescription>All transactions are secure and encrypted.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <RadioGroup defaultValue="card" value={formData.paymentMethod} onValueChange={(value) => handleInputChange('main', 'paymentMethod', value)}>
                             <Label htmlFor="paymentCard" className="flex items-center p-4 border rounded-md cursor-pointer hover:border-primary has-[input:checked]:border-primary has-[input:checked]:ring-2 has-[input:checked]:ring-primary">
                                <CreditCard className="mr-3 h-5 w-5 text-muted-foreground" />
                                <span className="font-medium">Credit/Debit Card</span>
                                <RadioGroupItem value="card" id="paymentCard" className="ml-auto" />
                            </Label>
                            <Label htmlFor="paymentMpesa" className="flex items-center p-4 border rounded-md cursor-pointer hover:border-primary has-[input:checked]:border-primary has-[input:checked]:ring-2 has-[input:checked]:ring-primary">
                                {/* Placeholder for M-Pesa Icon */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 text-muted-foreground"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
                                <span className="font-medium">M-Pesa</span>
                                <RadioGroupItem value="mpesa" id="paymentMpesa" className="ml-auto" />
                            </Label>
                        </RadioGroup>

                        {formData.paymentMethod === 'card' && (
                            <div className="space-y-3 pt-2">
                                <div>
                                    <Label htmlFor="cardNumber">Card Number</Label>
                                    <Input id="cardNumber" placeholder="•••• •••• •••• ••••" />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <Label htmlFor="expiryDate">Expiry Date</Label>
                                        <Input id="expiryDate" placeholder="MM/YY" />
                                    </div>
                                    <div>
                                        <Label htmlFor="cvc">CVC</Label>
                                        <Input id="cvc" placeholder="•••" />
                                    </div>
                                </div>
                            </div>
                        )}
                         {formData.paymentMethod === 'mpesa' && (
                            <div className="space-y-3 pt-2">
                                <div>
                                    <Label htmlFor="mpesaPhone">M-Pesa Phone Number</Label>
                                    <Input id="mpesaPhone" placeholder="07XX XXX XXX" />
                                </div>
                                <p className="text-sm text-muted-foreground">You will receive a prompt on your phone to enter your M-Pesa PIN.</p>
                            </div>
                        )}
                         <Button onClick={() => setCurrentStep('review')} className="w-full sm:w-auto">Review Order</Button>
                    </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="shadow-lg sticky top-24"> {/* Sticky for long forms */}
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-foreground font-headline">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {dummyCartItems.map(item => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                        <Image src={item.image} alt={item.name} width={40} height={40} className="rounded border object-cover" data-ai-hint="product item" />
                        <div>
                            <p className="font-medium text-foreground">{item.name} (x{item.quantity})</p>
                            {item.color && item.size && <p className="text-xs text-muted-foreground">{item.color}, {item.size}</p>}
                        </div>
                    </div>
                    <span className="text-foreground">KES {(item.price * item.quantity).toLocaleString()}</span>
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
              <div className="flex justify-between text-lg font-bold text-foreground">
                <span>Total</span>
                <span>KES {total.toLocaleString()}</span>
              </div>
              {currentStep === 'review' ? (
                <Button size="lg" className="w-full mt-4" onClick={handlePlaceOrder}>
                  <Lock className="mr-2 h-5 w-5" /> Place Order
                </Button>
              ) : (
                <Button size="lg" className="w-full mt-4" disabled>
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
