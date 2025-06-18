
"use client";

import { useState, useEffect, type FormEvent, useCallback } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { User, ShoppingBag, Heart, MapPin, Edit3, LogOut, Loader2, Award, Mail, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase'; 
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut, updateProfile, type User as FirebaseUser } from 'firebase/auth';
import { doc, setDoc, getDoc, collection, query, onSnapshot, deleteDoc, serverTimestamp } from 'firebase/firestore'; 
import { useToast } from '@/hooks/use-toast';
import InboxView from '@/components/features/profile/InboxView';
import { manageLoyaltyPoints } from '@/ai/flows/loyalty-points-flow';
import ProductCard, { type ProductCardProps } from '@/components/features/home/product-card';
import { getProductDetailsById } from '@/services/productService';


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

  const [profileWishlistItems, setProfileWishlistItems] = useState<ProductCardProps[]>([]);
  const [isProfileWishlistLoading, setIsProfileWishlistLoading] = useState(false);

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
          } else {
            // If user document doesn't exist, create it with basic info
            const newDisplayName = `${firstName} ${lastName}`.trim() || user.displayName;
            await setDoc(userDocRef, {
              email: user.email,
              displayName: newDisplayName,
              firstName: firstName,
              lastName: lastName,
              loyaltyPoints: 0,
              createdAt: serverTimestamp()
            }, { merge: true });
             setLoyaltyPoints(0);
          }
        } catch (firestoreError) {
            console.error("Error fetching/creating user data from Firestore:", firestoreError);
            toast({
                title: "Error",
                description: "Could not fetch or initialize profile details. Please try refreshing.",
                variant: "destructive"
            });
        }
      };
      fetchUserFirestoreData();
    }
  }, [user, loading, router, toast, firstName, lastName]); // Added firstName, lastName to deps for initial doc creation

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
        email: user.email, // Ensure email is also stored/updated if necessary
        displayName: newDisplayName,
      }, { merge: true }); 

      toast({ title: "Profile Updated", description: "Your profile information has been successfully updated." });

      try {
        const loyaltyResult = await manageLoyaltyPoints({
          userId: user.uid,
          activityType: 'profile_update',
        });
        setLoyaltyPoints(loyaltyResult.newTotalPoints); 
        toast({
          title: "Points Awarded!",
          description: `You've earned ${loyaltyResult.pointsChange} loyalty points for updating your profile! New total: ${loyaltyResult.newTotalPoints}.`,
        });
      } catch (loyaltyError: any) {
        console.error("Error awarding loyalty points:", loyaltyError);
        toast({
          title: "Loyalty Points Error",
          description: loyaltyError.message || "Could not award loyalty points for profile update.",
          variant: "destructive",
        });
      }

    } catch (updateError: any) {
      console.error("Error updating profile:", updateError);
      toast({ title: "Update Failed", description: updateError.message || "Could not update your profile.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const fetchProfileWishlistProducts = useCallback(async (productIds: string[]) => {
    if (!db) {
      console.error("DB not initialized for fetchProfileWishlistProducts");
      return;
    }
    setIsProfileWishlistLoading(true);
    const productsData: ProductCardProps[] = [];
    for (const productId of productIds) {
      const productDetails = await getProductDetailsById(productId);
      if (productDetails) {
        productsData.push({
          id: productDetails.id,
          name: productDetails.name,
          description: productDetails.description,
          image: productDetails.image,
          dataAiHint: productDetails.dataAiHint,
          fixedOfferPrice: productDetails.offerPrice,
          fixedOriginalPrice: productDetails.originalPrice,
        });
      }
    }
    setProfileWishlistItems(productsData);
    setIsProfileWishlistLoading(false);
  }, [toast]);

  useEffect(() => {
    if (activeSection === 'wishlist' && user && db) {
      setIsProfileWishlistLoading(true);
      const wishlistRef = collection(db, 'users', user.uid, 'wishlist');
      const q = query(wishlistRef);

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const productIds = snapshot.docs.map(doc => doc.id);
        fetchProfileWishlistProducts(productIds);
      }, (error) => {
        console.error("Error fetching profile wishlist:", error);
        toast({ title: "Error", description: "Could not load your wishlist for profile view.", variant: "destructive" });
        setIsProfileWishlistLoading(false);
      });
      return () => unsubscribe();
    }
  }, [activeSection, user, toast, fetchProfileWishlistProducts]);


  const handleRemoveFromProfileWishlist = async (productId: string) => {
    if (!user || !db) {
      toast({ title: "Error", description: "You must be logged in to modify your wishlist.", variant: "destructive" });
      return;
    }
    try {
      const wishlistItemRef = doc(db, 'users', user.uid, 'wishlist', productId);
      await deleteDoc(wishlistItemRef);
      toast({ title: "Removed from Wishlist", description: "The item has been removed from your wishlist." });
      // State updates via onSnapshot
    } catch (error) {
      console.error("Error removing from profile wishlist:", error);
      toast({ title: "Error", description: "Could not remove item from wishlist.", variant: "destructive" });
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
    // This should ideally be caught by the redirect in useEffect, but as a fallback:
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 flex justify-center items-center min-h-[calc(100vh-10rem)]">
           <p>Redirecting to login...</p>
           <Loader2 className="h-8 w-8 animate-spin text-primary ml-4" />
        </div>
    );
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
            <CardHeader>
              <CardTitle>My Wishlist</CardTitle>
              <CardDescription>Manage your saved items.</CardDescription>
            </CardHeader>
            <CardContent>
              {isProfileWishlistLoading ? (
                <div className="flex justify-center items-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : profileWishlistItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {profileWishlistItems.map((item) => (
                     <div key={item.id} className="relative group/wishlistitem-profile">
                      <ProductCard
                        id={item.id}
                        name={item.name}
                        description={item.description}
                        image={item.image}
                        dataAiHint={item.dataAiHint}
                        fixedOfferPrice={item.fixedOfferPrice}
                        fixedOriginalPrice={item.fixedOriginalPrice}
                      />
                       <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 opacity-0 group-hover/wishlistitem-profile:opacity-100 transition-opacity z-10 h-8 w-8"
                          onClick={() => handleRemoveFromProfileWishlist(item.id)}
                          aria-label="Remove from wishlist"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">Your wishlist is empty. Start adding products you love!</p>
              )}
               <Button variant="outline" size="sm" asChild className="mt-6">
                <Link href="/wishlist">View Full Wishlist Page</Link>
              </Button>
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

