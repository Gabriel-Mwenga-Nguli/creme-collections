
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
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/context/AuthContext';
import { isConfigured } from '@/lib/firebase';

const GoogleIcon = () => (
  <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
    <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
  </svg>
);

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { register, googleLogin } = useAuth();
  const isAuthDisabled = !isConfigured;

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      await register(fullName, email, password);
      toast({
        title: 'Registration Successful',
        description: "Welcome! We're logging you in.",
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Registration Failed',
        description: error.message || 'An unexpected error occurred.',
      });
    } finally {
      setIsLoading(false);
    }
  };

   const handleGoogleRegister = async () => {
    setIsLoading(true);
    try {
      await googleLogin();
      toast({
        title: 'Registration Successful',
        description: "Welcome! We're logging you in.",
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Google Sign-Up Failed',
        description: error.message || 'Could not sign up with Google.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-xl bg-card/90 backdrop-blur-sm mx-4">
      <CardHeader className="text-center px-4 py-6 sm:px-6">
        <CardTitle className="text-2xl sm:text-3xl font-bold text-primary font-headline">Create an Account</CardTitle>
        <CardDescription className="text-sm sm:text-base">Join us and start shopping smarter today.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 px-4 pb-6 sm:px-6">
        {isAuthDisabled && (
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-400/50 rounded-md text-center text-xs text-yellow-800 dark:text-yellow-300">
                <p className="font-bold mb-1">Authentication Not Configured</p>
                <p>
                The app's connection to the backend is missing.
                </p>
                <ul className="list-disc list-inside text-left mt-2">
                    <li><strong>For local development:</strong> Ensure your <code>.env.local</code> file is correctly set up.</li>
                    <li><strong>For deployed app:</strong> Firebase secrets must be set in your hosting environment.</li>
                </ul>
                <p className="mt-2">Please see the <code>README.md</code> for detailed instructions.</p>
            </div>
        )}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input 
              type="text" name="fullName" id="fullName" autoComplete="name" required 
              className="mt-1 text-base sm:text-sm" placeholder="Jane Doe"
              value={fullName} onChange={(e) => setFullName(e.target.value)} disabled={isLoading || isAuthDisabled}
            />
          </div>
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input 
              type="email" name="email" id="email" autoComplete="email" required 
              className="mt-1 text-base sm:text-sm" placeholder="you@example.com"
              value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading || isAuthDisabled}
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input 
              type="password" name="password" id="password" autoComplete="new-password" required 
              className="mt-1 text-base sm:text-sm" placeholder="••••••••"
              value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading || isAuthDisabled}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" required disabled={isAuthDisabled} />
            <Label htmlFor="terms" className="text-xs text-muted-foreground">
              I agree to the <Link href="/terms" className="underline hover:text-primary">Terms & Conditions</Link>.
            </Label>
          </div>
          <div>
            <Button type="submit" className="w-full" disabled={isLoading || isAuthDisabled}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Account
            </Button>
          </div>
        </form>
        
        <div className="relative my-4 sm:my-6">
          <div className="absolute inset-0 flex items-center">
            <Separator />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Or sign up with
            </span>
          </div>
        </div>

        <div>
          <Button variant="outline" className="w-full" onClick={handleGoogleRegister} disabled={isLoading || isAuthDisabled}>
             {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon />}
            Sign up with Google
          </Button>
        </div>

        <p className="text-center text-xs sm:text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Sign In
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
