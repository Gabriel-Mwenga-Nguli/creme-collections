
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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 flex items-center justify-center min-h-[calc(100vh-15rem)]">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary font-headline">Create Account</CardTitle>
          <CardDescription>Join Creme Lite and start shopping today!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form action="#" method="POST" className="space-y-4">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input type="text" name="fullName" id="fullName" autoComplete="name" required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input type="email" name="email" id="email" autoComplete="email" required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input type="password" name="password" id="password" autoComplete="new-password" required className="mt-1" />
            </div>
             <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input type="password" name="confirmPassword" id="confirmPassword" autoComplete="new-password" required className="mt-1" />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" name="terms" required />
              <Label htmlFor="terms" className="text-sm text-muted-foreground">
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
