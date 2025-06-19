
"use client"; 

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword, updateProfile, type User as FirebaseUser } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const GoogleIcon = () => (
  <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
    <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
  </svg>
);

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false); 
  const router = useRouter();
  const { toast } = useToast();

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match.", variant: "destructive" });
      return;
    }
    if (!agreedToTerms) {
      toast({ title: "Error", description: "You must agree to the terms and conditions.", variant: "destructive" });
      return;
    }
    setIsLoading(true);

    if (!auth || !db) {
      toast({ title: "Error", description: "Firebase services not available. Please try again later.", variant: "destructive" });
      setIsLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      const nameParts = fullName.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
      const calculatedDisplayName = fullName.trim() || email.split('@')[0];

      await updateProfile(firebaseUser, { displayName: calculatedDisplayName });

      const userDocRef = doc(db, "users", firebaseUser.uid);
      await setDoc(userDocRef, {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: calculatedDisplayName,
        firstName: firstName,
        lastName: lastName,
        photoURL: firebaseUser.photoURL,
        createdAt: serverTimestamp(),
        loyaltyPoints: 0,
      });

      toast({
        title: "Registration Successful!",
        description: "Your account has been created. Please log in.",
      });
      router.push('/login');

    } catch (error: any) {
      console.error("Firebase registration error:", error);
      let errorMessage = "Failed to register. Please try again.";
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "This email address is already in use.";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "The password is too weak. Please choose a stronger password.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "The email address is not valid.";
      }
      toast({ title: "Registration Failed", description: errorMessage, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoogleRegister = () => {
    console.log("Register with Google clicked - Not implemented in this iteration");
    toast({ title: "Coming Soon", description: "Google registration will be available in a future update.", variant: "default"});
  };

  return (
    <div 
      className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-10rem)] bg-cover bg-center"
      style={{ backgroundImage: "url('https://placehold.co/1920x1080.png')" }}
      data-ai-hint="abstract pattern"
    >
      <Card className="w-full max-w-md shadow-xl bg-card/90 backdrop-blur-sm mx-4">
        <CardHeader className="text-center px-4 py-6 sm:px-6">
          <CardTitle className="text-2xl sm:text-3xl font-bold text-primary font-headline">Create Account</CardTitle>
          <CardDescription className="text-sm sm:text-base">Join Creme Collections and start shopping today!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 px-4 pb-6 sm:px-6">
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input 
                type="text" 
                name="fullName" 
                id="fullName" 
                autoComplete="name" 
                required 
                className="mt-1 text-base sm:text-sm" 
                placeholder="Jane Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={isLoading || isGoogleLoading}
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
                className="mt-1 text-base sm:text-sm" 
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading || isGoogleLoading}
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
                className="mt-1 text-base sm:text-sm" 
                placeholder="•••••••• (min. 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading || isGoogleLoading}
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
                className="mt-1 text-base sm:text-sm" 
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading || isGoogleLoading}
              />
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox 
                id="terms" 
                name="terms" 
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                disabled={isLoading || isGoogleLoading}
              />
              <Label htmlFor="terms" className="text-xs sm:text-sm font-normal text-muted-foreground leading-snug">
                I agree to the{' '}
                <Link href="/terms" className="underline hover:text-primary">
                  Terms & Conditions
                </Link>
              </Label>
            </div>
            <div>
              <Button type="submit" className="w-full" disabled={isLoading || isGoogleLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
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
                Or continue with
              </span>
            </div>
          </div>

          <div>
            <Button variant="outline" className="w-full" onClick={handleGoogleRegister} disabled={isLoading || isGoogleLoading}>
              {isGoogleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon />}
              Register with Google
            </Button>
          </div>

          <p className="text-center text-xs sm:text-sm text-muted-foreground">
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
