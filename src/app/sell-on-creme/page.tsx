
import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Store, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Sell on Creme Collections - Grow Your Business',
  description: 'Join thousands of sellers and grow your business with Creme Collections. Reach millions of customers across Kenya with our powerful e-commerce platform.',
};

const benefits = [
  {
    icon: TrendingUp,
    title: 'Reach Millions of Customers',
    description: 'Tap into our large and growing customer base across Kenya and beyond.',
  },
  {
    icon: Store,
    title: 'Powerful Seller Tools',
    description: 'Manage your inventory, track sales, and fulfill orders with our easy-to-use Shop Manager dashboard.',
  },
  {
    icon: Users,
    title: 'Dedicated Support',
    description: 'Our team is here to help you get started and succeed every step of the way.',
  },
];

export default function SellOnCremePage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Store className="mx-auto h-12 w-12 text-primary mb-4" />
          <h1 className="text-4xl font-bold text-primary font-headline">Become a Seller on Creme Collections</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Partner with Kenya's trusted online marketplace and grow your business.
          </p>
        </div>

        <Card className="shadow-xl bg-card">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Why Sell With Us?</CardTitle>
            <CardDescription>Leverage our platform to boost your sales and expand your reach.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-6">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="flex flex-col items-center text-center p-4">
                  <benefit.icon className="h-10 w-10 text-primary mb-3" />
                  <h3 className="font-semibold text-foreground">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{benefit.description}</p>
                </div>
              ))}
            </div>
            
            <div className="text-center bg-primary/10 p-6 rounded-lg">
                <h2 className="text-xl font-bold text-primary mb-3">Ready to Get Started?</h2>
                <p className="text-muted-foreground mb-4">
                    The registration and verification process is currently handled manually by our team.
                    Please contact us to begin your application.
                </p>
                <Button asChild size="lg">
                    <Link href="/contact?subject=Seller Application Inquiry">
                        Contact Us to Apply
                    </Link>
                </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
