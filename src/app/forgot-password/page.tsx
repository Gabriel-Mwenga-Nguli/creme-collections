"use client";

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { auth } from '@/lib/firebase'; 
import { sendPasswordResetEmail } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handlePasswordReset = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    if (!auth) {
        toast({ title: 'Error', description: 'Firebase is not initialized.', variant: 'destructive' });
        setIsLoading(false);
        return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: 'Password Reset Email Sent',
        description: 'Please check your inbox for instructions to reset your password.',
      });
    } catch (error: any) {
        let errorMessage = 'Failed to send password reset email. Please try again.';
        if (error.code === 'auth/user-not-found') {
            errorMessage = 'No user found with this email address.';
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'Please enter a valid email address.';
        }
        toast({
            title: 'Error',
            description: errorMessage,
            variant: 'destructive',
        });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
        className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-10rem)] bg-secondary/30"
    >
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <Mail className="mx-auto h-12 w-12 text-primary mb-4" />
          <CardTitle className="text-2xl font-bold text-primary font-headline">Forgot Your Password?</CardTitle>
          <CardDescription>No problem. Enter your email and we'll send you a reset link.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input 
                type="email" 
                name="email" 
                id="email" 
                autoComplete="email" 
                required 
                className="mt-1" 
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
          <p className="text-center text-sm text-muted-foreground mt-6">
            Remembered your password?{' '}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Back to Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
