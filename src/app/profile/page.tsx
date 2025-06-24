
"use client";

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut, type User as FirebaseUser } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, User as UserIcon, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

export default function ProfilePage() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [signOutLoading, setSignOutLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!auth) {
      setError(new Error("Firebase not initialized."));
      setLoading(false);
      router.push('/login?redirect=/profile');
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push('/login?redirect=/profile');
      } else {
        setUser(currentUser);
      }
      setLoading(false);
    }, (err) => {
      setError(err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);
  
  const handleSignOut = async () => {
    if (!auth) return;
    setSignOutLoading(true);
    try {
        await signOut(auth);
        toast({ title: "Logged Out", description: "You have been successfully signed out." });
        router.push('/');
    } catch(e: any) {
        toast({ title: "Logout Failed", description: e.message, variant: 'destructive' });
    } finally {
        setSignOutLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  if (error) {
     return (
       <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-10rem)]">
        <p className="text-destructive">Error: {error.message}</p>
      </div>
     );
  }

  if (user) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <Card className="max-w-2xl mx-auto shadow-lg">
          <CardHeader className="text-center">
            <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-primary">
              <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
              <AvatarFallback className="text-4xl bg-muted">
                {user.displayName ? user.displayName.charAt(0).toUpperCase() : <UserIcon size={48} />}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-3xl font-bold font-headline">{user.displayName || 'Welcome!'}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
                <h3 className="font-semibold text-lg">My Account</h3>
                 <p className="text-muted-foreground text-sm">This is your profile page. More features like order history and address management will be available soon.</p>
            </div>
             <Button onClick={handleSignOut} className="w-full" variant="destructive" disabled={signOutLoading}>
                {signOutLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogOut className="mr-2 h-4 w-4" />}
                Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-10rem)]">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
}
