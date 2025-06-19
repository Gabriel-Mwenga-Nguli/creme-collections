
"use client";

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  const [messageSent, setMessageSent] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handlePasswordReset = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setMessageSent(false);

    if (!auth) {
      toast({
        title: 'Error',
        description: 'Authentication service is not available. Please try again later.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: 'Password Reset Email Sent',
        description: 'If an account exists for this email, a password reset link has been sent. Please check your inbox (and spam folder).',
      });
      setMessageSent(true);
    } catch (error: any) {
      let errorMessage = 'Failed to send password reset email. Please try again.';
      if (error.code === 'auth/invalid-email') {
        errorMessage = 'The email address you entered is not valid.';
      } else if (error.code === 'auth/user-not-found') {
        // To prevent email enumeration, we show a generic message for user-not-found too.
        // The success message already handles this by saying "If an account exists..."
        // So, we can log this internally but show a more generic error or rely on the success message's phrasing.
        console.warn("Password reset attempt for non-existent user:", email);
      }
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      console.error("Firebase password reset error:", error.code, error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-10rem)] bg-cover bg-center"
      style={{ backgroundImage: "url('/images/forms/login-banner.png')" }}
      data-ai-hint="secure access"
    >
      <Card className="w-full max-w-md shadow-xl bg-card/90 backdrop-blur-sm mx-4">
        <CardHeader className="text-center px-4 py-6 sm:px-6">
          <Mail className="mx-auto h-10 w-10 text-primary mb-3" />
          <CardTitle className="text-2xl sm:text-3xl font-bold text-primary font-headline">Reset Your Password</CardTitle>
          {!messageSent ? (
            <CardDescription className="text-sm sm:text-base">
              Enter your email address and we&apos;ll send you a link to reset your password.
            </CardDescription>
          ) : (
            <CardDescription className="text-sm sm:text-base text-green-600 dark:text-green-400">
              Password reset instructions have been sent to your email address (if it&apos;s associated with an account).
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-6 px-4 pb-6 sm:px-6">
          {!messageSent ? (
            <form onSubmit={handlePasswordReset} className="space-y-4">
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
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Send Reset Link
                </Button>
              </div>
            </form>
          ) : (
            <div className="text-center">
                <Button asChild className="w-full">
                    <Link href="/login">Back to Login</Link>
                </Button>
            </div>
          )}
          {!messageSent && (
            <p className="text-center text-xs sm:text-sm text-muted-foreground">
              Remembered your password?{' '}
              <Link href="/login" className="font-medium text-primary hover:underline">
                Log in
              </Link>
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
