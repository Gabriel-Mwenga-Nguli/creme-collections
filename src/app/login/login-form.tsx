"use client"; 

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { isConfigured } from '@/lib/firebase';

const GoogleIcon = () => (
  <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
    <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
  </svg>
);

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { login, googleLogin } = useAuth();
  const isAuthDisabled = !isConfigured;

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      toast({
        title: 'Login Successful',
        description: 'Welcome back! Redirecting you now.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: error.message || 'An unexpected error occurred.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await googleLogin();
      toast({
        title: 'Login Successful',
        description: 'Welcome back! Redirecting you now.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Google Login Failed',
        description: error.message || 'Could not sign in with Google.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-xl bg-card/90 backdrop-blur-sm mx-4">
      <CardHeader className="text-center px-4 py-6 sm:px-6">
        <CardTitle className="text-2xl sm:text-3xl font-bold text-primary font-headline">Welcome Back!</CardTitle>
        <CardDescription className="text-sm sm:text-base">Sign in to continue to your account.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 px-4 pb-6 sm:px-6">
        {isAuthDisabled && (
          <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-400/50 rounded-md text-center">
              <p className="text-xs text-yellow-800 dark:text-yellow-300">
                  Login is disabled. The app is not connected to a backend. See README for setup instructions.
              </p>
          </div>
        )}
        <form onSubmit={handleLogin} className="space-y-4">
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
              disabled={isLoading || isAuthDisabled}
            />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link href="/forgot-password" className="text-xs sm:text-sm text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <Input 
              type="password" 
              name="password" 
              id="password" 
              autoComplete="current-password" 
              required 
              className="mt-1 text-base sm:text-sm"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading || isAuthDisabled}
            />
          </div>
          <div>
            <Button type="submit" className="w-full" disabled={isLoading || isAuthDisabled}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Login
            </Button>
          </div>
        </form>
        
        <div className="relative my-4 sm:my-6">
          <div className="absolute inset-0 flex items-center">
            <Separator />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <div>
          <Button variant="outline" className="w-full" onClick={handleGoogleLogin} disabled={isLoading || isAuthDisabled}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon />}
            Login with Google
          </Button>
        </div>

        <p className="text-center text-xs sm:text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
