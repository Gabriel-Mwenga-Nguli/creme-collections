
import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export const metadata: Metadata = {
  title: 'Login - Creme Lite',
  description: 'Log in to your Creme Lite account.',
};

// Google Icon SVG
const GoogleIcon = () => (
  <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
    <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
  </svg>
);


export default function LoginPage() {
  const handleGoogleLogin = () => {
    // Placeholder for Google login logic
    console.log("Login with Google clicked");
    // In a real app, this would initiate the OAuth flow
  };

  return (
    <div 
      className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-10rem)] bg-cover bg-center"
      style={{ backgroundImage: "url('https://placehold.co/1920x1080/EAE6E2/A0937D.png?text=Abstract+Pattern&font=raleway')" }}
      data-ai-hint="abstract pattern"
    >
      <Card className="w-full max-w-md shadow-xl bg-card/90 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary font-headline">Welcome Back!</CardTitle>
          <CardDescription>Sign in to continue to your account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form action="#" method="POST" className="space-y-4">
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input 
                type="password" 
                name="password" 
                id="password" 
                autoComplete="current-password" 
                required 
                className="mt-1"
                placeholder="••••••••"
              />
            </div>
            <div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </div>
          </form>
          
          <div className="relative my-6">
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
            <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
              <GoogleIcon />
              Login with Google
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground">
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
