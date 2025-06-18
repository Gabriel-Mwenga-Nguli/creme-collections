
"use client";

import { useState, useEffect, type FormEvent } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { User, ShoppingBag, Heart, MapPin, Edit3, LogOut, Loader2, Award, Mail } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase'; 
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut, updateProfile, type User as FirebaseUser } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore'; 
import { useToast } from '@/hooks/use-toast';
import InboxView from '@/components/features/profile/InboxView'; // Import InboxView

type ProfileSection = "personal" | "orders" | "wishlist" | "addresses" | "inbox";

export default function ProfilePage() {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();
  const { toast } = useToast();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loyaltyPoints, setLoyaltyPoints] = useState<number>(0);
  const [isSaving, setIsSaving] = useState(false);
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [activeSection, setActiveSection] = useState<ProfileSection>("personal");


  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
    if (user && db) { 
      document.title = `${user.displayName || 'My Profile'} - Creme Collections`;

      const nameParts = user.displayName?.split(' ') || [''];
      setFirstName(nameParts[0] || 'User');
      setLastName(nameParts.length > 1 ? nameParts.slice(1).join(' ') : '');
      setEmail(user.email || '');

      const fetchUserFirestoreData = async () => {
        const userDocRef = doc(db, 'users', user.uid);
        try {
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setPhone(userData.phone || '');
            setLoyaltyPoints(userData.loyaltyPoints || 0);
            if (userData.firstName) setFirstName(userData.firstName);
            if (userData.lastName) setLastName(userData.lastName);
          }
        } catch (firestoreError) {
            console.error("Error fetching user data from Firestore:", firestoreError);
            toast({
                title: "Error",
                description: "Could not fetch some profile details. Please try refreshing.",
                variant: "destructive"
            });
        }
      };
      fetchUserFirestoreData();
    }
  }, [user, loading, router, toast]); 

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
      router.push('/');
    } catch (e) {
      console.error("Logout error:", e);
      toast({ title: 'Logout Failed', description: 'Could not log you out. Please try again.', variant: 'destructive' });
    }
  };
  
  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !db) {
        toast({ title: "Error", description: "User not signed in or database unavailable.", variant: "destructive" });
        return;
    }
    setIsSaving(true);
    try {
      const newDisplayName = `${firstName} ${lastName}`.trim();
      
      if (auth.currentUser) { 
        await updateProfile(auth.currentUser, { displayName: newDisplayName });
      } else {
        throw new Error("Current user not found in auth object.");
      }

      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        email: user.email, 
        displayName: newDisplayName,
      }, { merge: true }); 

      toast({ title: "Profile Updated", description: "Your profile has been successfully updated." });
    } catch (updateError: any) {
      console.error("Error updating profile:", updateError);
      toast({ title: "Update Failed", description: updateError.message || "Could not update your profile.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
     return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 text-center">
        <p className="text-destructive">Error loading user profile: {error.message}</p>
        <Button onClick={() => router.push('/login')} className="mt-4">Go to Login</Button>
      </div>
    );
  }

  if (!user) {
    return null; 
  }

  const getInitials = (name: string | null | undefined) => {
    if (!name) {
        const first = firstName || '';
        const last = lastName || '';
        if (first && last) return `${first[0]}${last[0]}`.toUpperCase();
        if (first) return first.substring(0,2).toUpperCase();
        return 'U';
    }
    const nameParts = name.split(' ');
    if (nameParts.length > 1) {
      return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };
  
  const creationDate = user.metadata.creationTime 
    ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'N/A';
  
  const currentDisplayName = `${firstName} ${lastName}`.trim() || user.displayName || 'User';

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'personal':
        return (
          <Card className="md:col-span-2 shadow-lg">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl font-headline">Edit Profile</CardTitle>
              </div>
              <CardDescription>Update your personal details here.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form className="space-y-4" onSubmit={handleSaveChanges}>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} className="mt-1" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" value={email} className="mt-1 bg-muted/50" readOnly disabled />
                  <p className="text-xs text-muted-foreground mt-1">Email address cannot be changed here. Please contact support for assistance.</p>
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="+254 7XX XXX XXX" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1" />
                </div>
                 <Separator className="my-4"/>
                 <p className="text-sm text-muted-foreground">To change your password, please use the "Forgot Password" option on the login page or contact support for assistance. Direct password changes here are not yet enabled.</p>
                 <div>
                  <Label htmlFor="currentPassword">Current Password (disabled)</Label>
                  <Input id="currentPassword" type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="For future use" className="mt-1" disabled />
                </div>
                 <div>
                  <Label htmlFor="newPassword">New Password (disabled)</Label>
                  <Input id="newPassword" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="For future use" className="mt-1" disabled />
                </div>
                <div className="pt-2">
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        );
      case 'inbox':
        return <InboxView userId={user.uid} userEmail={user.email} />;
      case 'orders':
        return (
          <Card className="md:col-span-2 shadow-lg">
            <CardHeader><CardTitle>My Orders</CardTitle><CardDescription>View your order history.</CardDescription></CardHeader>
            <CardContent><p className="text-muted-foreground">Order history feature coming soon.</p></CardContent>
          </Card>
        );
      case 'wishlist':
         return (
          <Card className="md:col-span-2 shadow-lg">
            <CardHeader><CardTitle>My Wishlist</CardTitle><CardDescription>Manage your saved items.</CardDescription></CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Wishlist feature coming soon. For now, you can view your wishlist <Link href="/wishlist" className="text-primary underline">here</Link>.</p>
            </CardContent>
          </Card>
        );
      case 'addresses':
        return (
          <Card className="md:col-span-2 shadow-lg">
            <CardHeader><CardTitle>Shipping Addresses</CardTitle><CardDescription>Manage your shipping addresses.</CardDescription></CardHeader>
            <CardContent><p className="text-muted-foreground">Address management feature coming soon.</p></CardContent>
          </Card>
        );
      default:
        return null;
    }
  };


  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <User className="mx-auto h-12 w-12 text-primary mb-4" />
          <h1 className="text-4xl font-bold text-primary font-headline">My Account</h1>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-start">
          <Card className="md:col-span-1 shadow-lg">
            <CardHeader className="items-center text-center">
              <Avatar className="w-24 h-24 mb-4 border-2 border-primary">
                <AvatarImage src={user.photoURL || undefined} alt={currentDisplayName} data-ai-hint="profile avatar" />
                <AvatarFallback className="text-2xl bg-muted">{getInitials(currentDisplayName)}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-2xl">{currentDisplayName}</CardTitle>
              <CardDescription>{email || 'No email provided'}</CardDescription>
              <CardDescription className="text-xs">Joined {creationDate}</CardDescription>
              <div className="mt-3 pt-3 border-t w-full">
                <div className="flex items-center justify-center text-lg font-semibold text-primary">
                  <Award className="mr-2 h-5 w-5" />
                  <span>{loyaltyPoints.toLocaleString()} Loyalty Points</span>
                </div>
                 <CardDescription className="text-xs mt-1">Earn points with purchases & reviews!</CardDescription>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="p-4 space-y-1">
              <Button variant="ghost" onClick={() => setActiveSection("personal")} className={`w-full justify-start ${activeSection === 'personal' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-primary hover:bg-primary/10'}`}>
                <User className="mr-2 h-4 w-4" /> Personal Information
              </Button>
              <Button variant="ghost" onClick={() => setActiveSection("inbox")} className={`w-full justify-start ${activeSection === 'inbox' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-primary hover:bg-primary/10'}`}>
                <Mail className="mr-2 h-4 w-4" /> My Inbox
              </Button>
              <Button variant="ghost" onClick={() => setActiveSection("orders")} className={`w-full justify-start ${activeSection === 'orders' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-primary hover:bg-primary/10'}`}>
                <ShoppingBag className="mr-2 h-4 w-4" /> My Orders
              </Button>
              <Button variant="ghost" onClick={() => setActiveSection("wishlist")} className={`w-full justify-start ${activeSection === 'wishlist' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-primary hover:bg-primary/10'}`}>
                <Heart className="mr-2 h-4 w-4" /> My Wishlist
              </Button>
              <Button variant="ghost" onClick={() => setActiveSection("addresses")} className={`w-full justify-start ${activeSection === 'addresses' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-primary hover:bg-primary/10'}`}>
                <MapPin className="mr-2 h-4 w-4" /> Shipping Addresses
              </Button>
              <Separator className="my-2"/>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </CardContent>
          </Card>

          {renderSectionContent()}
          
        </div>
      </div>
    </div>
  );
}
