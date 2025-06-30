
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Lock, UserCircle, MapPin, Phone as PhoneIcon } from 'lucide-react';

const checkoutFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters."),
  lastName: z.string().min(2, "Last name must be at least 2 characters."),
  addressLine1: z.string().min(5, "Please enter a valid address."),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "Please enter a valid city."),
  postalCode: z.string().min(3, "Please enter a valid postal code."),
  phone: z.string().min(10, "Please enter a valid phone number."),
});

export type CheckoutFormData = z.infer<typeof checkoutFormSchema>;

interface CheckoutFormProps {
  onCheckout: (data: CheckoutFormData) => Promise<void>;
  isProcessing: boolean;
}

export default function CheckoutForm({ onCheckout, isProcessing }: CheckoutFormProps) {
  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      postalCode: '',
      phone: '',
    },
  });

  return (
    <Card className="shadow-lg">
        <CardHeader>
            <CardTitle className="text-xl font-semibold font-headline">Shipping Information</CardTitle>
            <CardDescription>Enter the address where you want to receive your order.</CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onCheckout)} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                        <FormField control={form.control} name="firstName" render={({ field }) => (
                            <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl><Input {...field} placeholder="Jane" disabled={isProcessing} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                         <FormField control={form.control} name="lastName" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Last Name</FormLabel>
                                <FormControl><Input {...field} placeholder="Doe" disabled={isProcessing} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>
                     <FormField control={form.control} name="addressLine1" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Address Line 1</FormLabel>
                            <FormControl><Input {...field} placeholder="e.g., 123 Riverside Drive" disabled={isProcessing} /></FormControl>
                             <FormMessage />
                        </FormItem>
                    )} />
                     <FormField control={form.control} name="addressLine2" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Address Line 2 (Optional)</FormLabel>
                            <FormControl><Input {...field} placeholder="Apt, suite, etc." disabled={isProcessing} /></FormControl>
                             <FormMessage />
                        </FormItem>
                    )} />
                     <div className="grid sm:grid-cols-2 gap-4">
                        <FormField control={form.control} name="city" render={({ field }) => (
                            <FormItem>
                                <FormLabel>City</FormLabel>
                                <FormControl><Input {...field} placeholder="Nairobi" disabled={isProcessing} /></FormControl>
                                 <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="postalCode" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Postal Code</FormLabel>
                                <FormControl><Input {...field} placeholder="00100" disabled={isProcessing} /></FormControl>
                                 <FormMessage />
                            </FormItem>
                        )} />
                     </div>
                     <FormField control={form.control} name="phone" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl><Input {...field} type="tel" placeholder="+254 7XX XXX XXX" disabled={isProcessing} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <div className="pt-4">
                        <Button type="submit" size="lg" className="w-full" disabled={isProcessing}>
                            {isProcessing && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                            Place Order
                        </Button>
                    </div>
                </form>
            </Form>
        </CardContent>
    </Card>
  );
}
