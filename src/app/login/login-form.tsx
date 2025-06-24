"use client"; 

import { useState, type FormEvent, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { auth } from '@/lib/firebase'; 
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const GoogleIcon = () => (
  <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
    <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
  </svg>
);

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  // Redirect if already logged in
  useEffect(() => {
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          const redirectUrl = searchParams.get('redirect') || '/profile';
          router.replace(redirectUrl);
        }
      });
      return () => unsubscribe();
    }
  }, [router, searchParams]);


  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    if (!auth) {
      toast({
        title: 'Error',
        description: 'Firebase authentication is not initialized. Please try again later.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: 'Login Successful!',
        description: 'Welcome back to Creme Collections!',
      });
      const redirectUrl = searchParams.get('redirect') || '/profile';
      router.push(redirectUrl); 
    } catch (error: any) {
      let errorMessage = 'Failed to login. Please check your credentials and try again.';
      
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = 'Invalid email or password. Please try again.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'The email address you entered is not valid. Please check and try again.';
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = 'This account has been disabled. Please contact support.';
      }
      console.error("Firebase login error:", error.code, error.message);
      toast({
        title: 'Login Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    if (!auth) {
      toast({
        title: 'Error',
        description: 'Firebase authentication is not initialized. Please try again later.',
        variant: 'destructive',
      });
      setIsGoogleLoading(false);
      return;
    }
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast({
        title: 'Login Successful!',
        description: 'Welcome to Creme Collections!',
      });
      const redirectUrl = searchParams.get('redirect') || '/profile';
      router.push(redirectUrl); 
    } catch (error: any) {
      console.error("Google login error:", error);
      let errorMessage = 'Failed to login with Google. Please try again.';
       if (error.code === 'auth/unauthorized-domain') {
        errorMessage = "This website's domain is not authorized for Google Sign-In. An admin must add this domain to the Firebase Console -> Authentication -> Settings -> Authorized domains.";
      } else if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Google login was cancelled.';
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        errorMessage = 'An account already exists with this email address using a different sign-in method.';
      }
      toast({
        title: 'Google Login Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsGoogleLoading(false);
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
          <CardTitle className="text-2xl sm:text-3xl font-bold text-primary font-headline">Welcome Back!</CardTitle>
          <CardDescription className="text-sm sm:text-base">Sign in to continue to your account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 px-4 pb-6 sm:px-6">
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
                disabled={isLoading || isGoogleLoading}
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
                disabled={isLoading || isGoogleLoading}
              />
            </div>
            <div>
              <Button type="submit" className="w-full" disabled={isLoading || isGoogleLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
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
            <Button variant="outline" className="w-full" onClick={handleGoogleLogin} disabled={isLoading || isGoogleLoading}>
              {isGoogleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon />}
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
    </div>
  );
}
