
"use client";

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, KeyRound } from 'lucide-react';
import type { Metadata } from 'next';

// export const metadata: Metadata = { // Cannot be used in a Client Component
//   title: 'Forgot Password - Creme Collections',
//   description: 'Reset your Creme Collections account password.',
// };

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: "Password Reset Link Sent",
      description: "If an account exists for this email, a reset link has been sent.",
    });

    setIsLoading(false);
    setEmail('');
  };

  return (
    <div 
      className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-10rem)] bg-cover bg-center"
      style={{ backgroundImage: "url('/images/forms/login-banner.png')" }}
      data-ai-hint="secure access"
    >
      <Card className="w-full max-w-md shadow-xl bg-card/90 backdrop-blur-sm mx-4">
        <CardHeader className="text-center px-4 py-6 sm:px-6">
          <KeyRound className="mx-auto h-10 w-10 text-primary mb-2" />
          <CardTitle className="text-2xl sm:text-3xl font-bold text-primary font-headline">Forgot Your Password?</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            No problem. Enter your email and we'll send you a reset link.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 px-4 pb-6 sm:px-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                type="email"
                name="email"
                id="email"
                autoComplete="email"
                required
                className="mt-1 text-base sm:text-sm"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send Reset Link
              </Button>
            </div>
          </form>

          <p className="text-center text-xs sm:text-sm text-muted-foreground">
            Remember your password?{' '}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Sign In
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
