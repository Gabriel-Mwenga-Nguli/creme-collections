
import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Register - Creme Lite',
  description: 'Create a new Creme Lite account.',
};

export default function RegisterPage() {
  return (
    <div 
      className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-10rem)] bg-cover bg-center"
      style={{ backgroundImage: "url('https://placehold.co/1920x1080/EAE6E2/A0937D.png?text=Abstract+Pattern&font=raleway')" }}
      data-ai-hint="abstract pattern"
    >
      <Card className="w-full max-w-md shadow-xl bg-card/90 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary font-headline">Create Account</CardTitle>
          <CardDescription>Join Creme Lite and start shopping today!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form action="#" method="POST" className="space-y-4">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input 
                type="text" 
                name="fullName" 
                id="fullName" 
                autoComplete="name" 
                required 
                className="mt-1" 
                placeholder="Jane Doe"
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input 
                type="email" 
                name="email" 
                id="email" 
                autoComplete="email" 
                required 
                className="mt-1" 
                placeholder="you@example.com"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input 
                type="password" 
                name="password" 
                id="password" 
                autoComplete="new-password" 
                required 
                className="mt-1" 
                placeholder="••••••••"
              />
            </div>
             <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input 
                type="password" 
                name="confirmPassword" 
                id="confirmPassword" 
                autoComplete="new-password" 
                required 
                className="mt-1" 
                placeholder="••••••••"
              />
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox id="terms" name="terms" required />
              <Label htmlFor="terms" className="text-sm font-normal text-muted-foreground leading-snug">
                I agree to the{' '}
                <Link href="/terms" className="underline hover:text-primary">
                  Terms & Conditions
                </Link>
              </Label>
            </div>
            <div>
              <Button type="submit" className="w-full">
                Create Account
              </Button>
            </div>
          </form>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Log in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
