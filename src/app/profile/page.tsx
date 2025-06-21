
"use client";

import React, { useState, useEffect, type FormEvent, useCallback } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { User, ShoppingBag, Heart, MapPin, LogOut, Loader2, Award, Mail, Trash2, Edit3, Camera, ListOrdered, PlusCircle, SlidersHorizontal, FileText } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { auth, db, storage } from '@/lib/firebase'; 
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut, updateProfile, type User as FirebaseUser } from 'firebase/auth';
import { doc, setDoc, getDoc, collection, query, onSnapshot, deleteDoc, serverTimestamp, Timestamp, addDoc } from 'firebase/firestore'; 
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useToast } from '@/hooks/use-toast';
import InboxView from '@/components/features/profile/InboxView';
import { manageLoyaltyPoints } from '@/ai/flows/loyalty-points-flow';
import ProductCard, { type ProductCardProps } from '@/components/features/home/product-card';
import { getProductDetailsById } from '@/services/productService';
import type { Order, Address } from '@/services/orderService'; 
import { getUserOrders } from '@/services/orderService';
import { getUserAddresses, addUserAddress } from '@/services/addressService';
import type { Invoice } from '@/services/invoiceService';
import { getUserInvoices } from '@/services/invoiceService';
import { format } from 'date-fns';
import { Sheet, SheetTrigger, SheetContent, SheetClose } from '@/components/ui/sheet'; // For mobile sidebar

type ProfileSection = "personal" | "orders" | "wishlist" | "addresses" | "inbox" | "invoices";

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
  
  const [activeSection, setActiveSection] = useState<ProfileSection>("personal");
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);


  const [profileWishlistItems, setProfileWishlistItems] = useState<ProductCardProps[]>([]);
  const [isProfileWishlistLoading, setIsProfileWishlistLoading] = useState(false);

  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [isOrdersLoading, setIsOrdersLoading] = useState(false);

  const [userInvoices, setUserInvoices] = useState<Invoice[]>([]);
  const [isInvoicesLoading, setIsInvoicesLoading] = useState(false);

  const [userAddresses, setUserAddresses] = useState<Address[]>([]);
  const [isAddressesLoading, setIsAddressesLoading] = useState(false);
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState<Omit<Address, 'id' | 'userId'>>({
    name: '', firstName: '', lastName: '', addressLine1: '', city: '', postalCode: '', phone: '', isDefault: false, country: 'Kenya'
  });
  const [isAddingAddress, setIsAddingAddress] = useState(false);


  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);


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
      if (user.photoURL) {
        setPreviewUrl(user.photoURL);
      }

      const userDocRef = doc(db, 'users', user.uid);
      const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setPhone(userData.phone || '');
          setLoyaltyPoints(userData.loyaltyPoints || 0);
          if (userData.firstName) setFirstName(userData.firstName);
          if (userData.lastName) setLastName(userData.lastName);
        } else {
          // If doc doesn't exist, create it. This can happen on first login.
          const currentFirstName = nameParts[0] || '';
          const currentLastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
          const newDisplayName = `${currentFirstName} ${currentLastName}`.trim() || user.displayName;
          
          setDoc(userDocRef, {
            email: user.email,
            displayName: newDisplayName,
            firstName: currentFirstName,
            lastName: currentLastName,
            loyaltyPoints: 0,
            createdAt: serverTimestamp(),
            photoURL: user.photoURL || null,
          }, { merge: true }).catch(e => console.error("Error creating user doc:", e));
          
          setLoyaltyPoints(0);
        }
      }, (firestoreError) => {
        console.error("Error fetching/creating user data from Firestore:", firestoreError);
        toast({
          title: "Error",
          description: "Could not fetch or initialize profile details. Please try refreshing.",
          variant: "destructive"
        });
      });
      
      return () => unsubscribe();
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
        if (auth.currentUser.displayName !== newDisplayName) {
            await updateProfile(auth.currentUser, { displayName: newDisplayName });
        }
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

      toast({ title: "Profile Updated", description: "Your profile information has been successfully updated." });

      try {
        const loyaltyResult = await manageLoyaltyPoints({
          userId: user.uid,
          activityType: 'profile_update',
        });
        // The onSnapshot listener will automatically update the loyaltyPoints state.
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
    if (!db) return;
    setIsProfileWishlistLoading(true);
    const productsData: ProductCardProps[] = [];
    for (const productId of productIds) {
      const productDetails = await getProductDetailsById(productId);
      if (productDetails) {
        productsData.push({
          id: productDetails.id, name: productDetails.name, description: productDetails.description,
          image: productDetails.image, dataAiHint: productDetails.dataAiHint,
          fixedOfferPrice: productDetails.offerPrice, fixedOriginalPrice: productDetails.originalPrice,
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
        toast({ title: "Error", description: "Could not load your wishlist.", variant: "destructive" });
        setIsProfileWishlistLoading(false);
      });
      return () => unsubscribe();
    }
  }, [activeSection, user, toast, fetchProfileWishlistProducts]);


  const handleRemoveFromProfileWishlist = async (productId: string) => {
    if (!user || !db) return;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'wishlist', productId));
      toast({ title: "Removed from Wishlist", description: "Item removed successfully." });
    } catch (error) {
      console.error("Error removing from profile wishlist:", error);
      toast({ title: "Error", description: "Could not remove item.", variant: "destructive" });
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (!file.type.startsWith('image/')) {
        toast({ title: "Invalid File", description: "Please select an image file.", variant: "destructive" });
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({ title: "File Too Large", description: "Image size should not exceed 5MB.", variant: "destructive" });
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleImageUpload = async () => {
    if (!selectedFile || !user || !storage || !db) return;
    setIsUploading(true);
    try {
      const fileExtension = selectedFile.name.split('.').pop();
      const imageRef = storageRef(storage, `profilePictures/${user.uid}/profileImage.${fileExtension}`);
      const snapshot = await uploadBytes(imageRef, selectedFile);
      const downloadURL = await getDownloadURL(snapshot.ref);
      if (auth.currentUser) await updateProfile(auth.currentUser, { photoURL: downloadURL });
      await setDoc(doc(db, 'users', user.uid), { photoURL: downloadURL }, { merge: true });
      setPreviewUrl(downloadURL);
      setSelectedFile(null);
      toast({ title: "Profile Picture Updated" });
    } catch (uploadError: any) {
      toast({ title: "Upload Failed", description: uploadError.message, variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    if (activeSection === 'orders' && user && db) {
      setIsOrdersLoading(true);
      getUserOrders(user.uid)
        .then(setUserOrders)
        .catch(err => toast({ title: "Error", description: "Could not fetch orders.", variant: "destructive" }))
        .finally(() => setIsOrdersLoading(false));
    }
  }, [activeSection, user, toast]);

   useEffect(() => {
    if (activeSection === 'invoices' && user && db) {
      setIsInvoicesLoading(true);
      getUserInvoices(user.uid)
        .then(setUserInvoices)
        .catch(err => toast({ title: "Error", description: "Could not fetch invoices.", variant: "destructive" }))
        .finally(() => setIsInvoicesLoading(false));
    }
  }, [activeSection, user, toast]);

  useEffect(() => {
    if (activeSection === 'addresses' && user && db) {
      setIsAddressesLoading(true);
      const addressesRef = collection(db, 'users', user.uid, 'addresses');
      const unsubscribe = onSnapshot(addressesRef, (snapshot) => {
        const fetchedAddresses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Address));
        setUserAddresses(fetchedAddresses);
        setIsAddressesLoading(false);
      }, (error) => {
        console.error("Error fetching addresses:", error);
        toast({ title: "Error", description: "Could not load addresses.", variant: "destructive" });
        setIsAddressesLoading(false);
      });
      return () => unsubscribe();
    }
  }, [activeSection, user, toast]);

  const handleAddressInputChange = (field: keyof Omit<Address, 'id' | 'userId'>, value: string | boolean) => {
    setNewAddress(prev => ({ ...prev, [field]: value }));
  };

  const handleAddNewAddress = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsAddingAddress(true);
    try {
      await addUserAddress(user.uid, newAddress);
      toast({ title: "Address Added", description: "New shipping address saved." });
      setNewAddress({ name: '', firstName: '', lastName: '', addressLine1: '', city: '', postalCode: '', phone: '', isDefault: false, country: 'Kenya' });
      setShowAddAddressForm(false);
    } catch (error) {
      toast({ title: "Error", description: "Could not add address.", variant: "destructive" });
    } finally {
      setIsAddingAddress(false);
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
    if (nameParts.length > 1) return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };
  
  const creationDate = user.metadata.creationTime 
    ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'N/A';
  
  const currentDisplayName = `${firstName} ${lastName}`.trim() || user.displayName || 'User';
  const displayPhotoUrl = previewUrl || user.photoURL;

  const ProfileSidebarContent = () => (
     <Card className="shadow-lg h-full">
        <CardHeader className="items-center text-center p-4 md:p-6">
          <div className="relative group/avatar">
            <Avatar className="w-20 h-20 sm:w-24 sm:h-24 mb-3 md:mb-4 border-2 border-primary"><AvatarImage src={displayPhotoUrl || undefined} alt={currentDisplayName} data-ai-hint="profile avatar" /><AvatarFallback className="text-xl sm:text-2xl bg-muted">{getInitials(currentDisplayName)}</AvatarFallback></Avatar>
            <Button variant="outline" size="icon" className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 rounded-full h-7 w-7 sm:h-8 sm:w-8 bg-background/80 hover:bg-background group-hover/avatar:opacity-100 md:opacity-0 transition-opacity" onClick={() => fileInputRef.current?.click()} aria-label="Change"><Camera className="h-3 w-3 sm:h-4 sm:w-4" /></Button>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
          </div>
          {selectedFile && (<div className="text-center mt-1 mb-2"><p className="text-xs text-muted-foreground">Selected: {selectedFile.name}</p><Button size="sm" onClick={handleImageUpload} disabled={isUploading} className="mt-1 h-8 text-xs px-2">{isUploading && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}Upload Picture</Button></div>)}
          <CardTitle className="text-xl md:text-2xl">{currentDisplayName}</CardTitle>
          <CardDescription className="text-xs sm:text-sm">{email || 'No email'}</CardDescription>
          <CardDescription className="text-xs">Joined {creationDate}</CardDescription>
          <div className="mt-2 pt-2 sm:mt-3 sm:pt-3 border-t w-full"><div className="flex items-center justify-center text-sm sm:text-lg font-semibold text-primary"><Award className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" /><span>{loyaltyPoints.toLocaleString()} Loyalty Points</span></div><CardDescription className="text-xs mt-0.5 sm:mt-1">Earn points with activity!</CardDescription></div>
        </CardHeader>
        <Separator />
        <CardContent className="p-2 sm:p-4 space-y-0.5 sm:space-y-1">
          {(['personal', 'orders', 'invoices', 'wishlist', 'addresses', 'inbox'] as ProfileSection[]).map(section => (
            <SheetClose asChild key={section}>
              <Button 
                variant="ghost" 
                onClick={() => { setActiveSection(section); setIsMobileSheetOpen(false);}} 
                className={`w-full justify-start text-sm md:text-base px-2 sm:px-3 py-1.5 sm:py-2 h-auto ${activeSection === section ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-primary hover:bg-primary/10'}`}
              >
                {section === 'personal' && <User className="mr-2 h-4 w-4" />}
                {section === 'orders' && <ShoppingBag className="mr-2 h-4 w-4" />}
                {section === 'invoices' && <FileText className="mr-2 h-4 w-4" />}
                {section === 'wishlist' && <Heart className="mr-2 h-4 w-4" />}
                {section === 'addresses' && <MapPin className="mr-2 h-4 w-4" />}
                {section === 'inbox' && <Mail className="mr-2 h-4 w-4" />}
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </Button>
            </SheetClose>
          ))}
          <Separator className="my-1 sm:my-2"/>
           <SheetClose asChild>
            <Button variant="ghost" className="w-full justify-start text-sm md:text-base text-destructive hover:text-destructive/80 hover:bg-destructive/10 px-2 sm:px-3 py-1.5 sm:py-2 h-auto" onClick={handleLogout}><LogOut className="mr-2 h-4 w-4" /> Logout</Button>
          </SheetClose>
        </CardContent>
      </Card>
  );


  const renderSectionContent = () => {
    switch (activeSection) {
      case 'personal':
        return (
          <Card className="shadow-lg">
            <CardHeader><CardTitle className="text-xl md:text-2xl font-headline">Edit Profile</CardTitle><CardDescription>Update your personal details here.</CardDescription></CardHeader>
            <CardContent className="space-y-4 md:space-y-6">
              <form className="space-y-3 md:space-y-4" onSubmit={handleSaveChanges}>
                <div className="grid sm:grid-cols-2 gap-3 md:gap-4">
                  <div><Label htmlFor="firstName">First Name</Label><Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="mt-1 text-base md:text-sm" /></div>
                  <div><Label htmlFor="lastName">Last Name</Label><Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} className="mt-1 text-base md:text-sm" /></div>
                </div>
                <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" value={email} className="mt-1 bg-muted/50 cursor-not-allowed text-base md:text-sm" readOnly disabled />
                    <p className="text-xs text-muted-foreground mt-1">Email address cannot be changed here. Please contact support for assistance.</p>
                </div>
                <div><Label htmlFor="phone">Phone Number</Label><Input id="phone" type="tel" placeholder="+254 7XX XXX XXX" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 text-base md:text-sm" /></div>
                <div className="pt-1 md:pt-2"><Button type="submit" disabled={isSaving}>{isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Save Changes</Button></div>
              </form>
            </CardContent>
          </Card>
        );
      case 'inbox':
        return <InboxView userId={user.uid} userEmail={user.email} />;
      case 'orders':
        return (
          <Card className="shadow-lg">
            <CardHeader><CardTitle className="flex items-center gap-2 text-xl md:text-2xl"><ListOrdered />My Orders</CardTitle><CardDescription>View your order history.</CardDescription></CardHeader>
            <CardContent>
              {isOrdersLoading ? <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                : userOrders.length > 0 ? (
                  <ul className="space-y-3 md:space-y-4">
                    {userOrders.map(order => (
                      <li key={order.id} className="p-3 md:p-4 border rounded-md hover:shadow-md transition-shadow">
                        <Link href={`/profile/orders/${order.id}`}>
                          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                            <div>
                              <p className="font-semibold text-primary text-sm sm:text-base">Order ID: {order.orderId || order.id}</p>
                              <p className="text-xs sm:text-sm text-muted-foreground">Date: {order.orderDate ? format(order.orderDate.toDate(), 'PPP') : 'N/A'}</p>
                            </div>
                            <div className="text-left sm:text-right mt-1 sm:mt-0">
                              <p className="font-semibold text-sm sm:text-base">KES {order.totalAmount.toLocaleString()}</p>
                              <p className={`text-xs sm:text-sm font-medium ${order.status === 'Delivered' ? 'text-green-600' : order.status === 'Cancelled' ? 'text-red-600' : 'text-yellow-600'}`}>{order.status}</p>
                            </div>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : <p className="text-muted-foreground text-center py-10">You have no orders yet.</p>}
            </CardContent>
          </Card>
        );
      case 'invoices':
        return (
          <Card className="shadow-lg">
            <CardHeader><CardTitle className="flex items-center gap-2 text-xl md:text-2xl"><FileText />My Invoices</CardTitle><CardDescription>View your past invoices.</CardDescription></CardHeader>
            <CardContent>
              {isInvoicesLoading ? <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                : userInvoices.length > 0 ? (
                  <ul className="space-y-3 md:space-y-4">
                    {userInvoices.map(invoice => (
                      <li key={invoice.id} className="p-3 md:p-4 border rounded-md hover:shadow-md transition-shadow flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                          <div>
                            <p className="font-semibold text-primary text-sm sm:text-base">Invoice ID: {invoice.invoiceId}</p>
                            <p className="text-xs sm:text-sm text-muted-foreground">For Order: {invoice.orderId}</p>
                             <p className="text-xs sm:text-sm text-muted-foreground">Date: {invoice.invoiceDate ? format(invoice.invoiceDate.toDate(), 'PPP') : 'N/A'}</p>
                          </div>
                          <div className="text-left sm:text-right mt-1 sm:mt-0">
                            <p className="font-semibold text-sm sm:text-base">KES {invoice.totalAmount.toLocaleString()}</p>
                            <p className={`text-xs sm:text-sm font-medium ${invoice.status === 'Paid' ? 'text-green-600' : 'text-yellow-600'}`}>{invoice.status}</p>
                          </div>
                      </li>
                    ))}
                  </ul>
                ) : <p className="text-muted-foreground text-center py-10">You have no invoices yet.</p>}
            </CardContent>
          </Card>
        );
      case 'wishlist':
        return (
          <Card className="shadow-lg">
            <CardHeader><CardTitle className="flex items-center gap-2 text-xl md:text-2xl"><Heart />My Wishlist</CardTitle><CardDescription>Manage your saved items.</CardDescription></CardHeader>
            <CardContent>
              {isProfileWishlistLoading ? <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                : profileWishlistItems.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                    {profileWishlistItems.map((item) => (
                       <div key={item.id} className="relative group/wishlistitem-profile">
                        <ProductCard {...item} />
                         <Button variant="destructive" size="icon" className="absolute top-2 right-2 opacity-0 group-hover/wishlistitem-profile:opacity-100 transition-opacity z-10 h-7 w-7 sm:h-8 sm:w-8" onClick={() => handleRemoveFromProfileWishlist(item.id)} aria-label="Remove"><Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" /></Button>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-muted-foreground text-center py-10">Your wishlist is empty.</p>}
            </CardContent>
          </Card>
        );
      case 'addresses':
        return (
          <Card className="shadow-lg">
            <CardHeader className="flex flex-col sm:flex-row justify-between sm:items-center">
              <div>
                <CardTitle className="flex items-center gap-2 text-xl md:text-2xl"><MapPin />Shipping Addresses</CardTitle>
                <CardDescription>Manage your shipping addresses.</CardDescription>
              </div>
              <Button onClick={() => setShowAddAddressForm(prev => !prev)} size="sm" variant="outline" className="mt-2 sm:mt-0 self-start sm:self-center">
                <PlusCircle className="mr-2 h-4 w-4" /> {showAddAddressForm ? 'Cancel' : 'Add New'}
              </Button>
            </CardHeader>
            <CardContent>
              {showAddAddressForm && (
                <form onSubmit={handleAddNewAddress} className="space-y-3 md:space-y-4 p-3 md:p-4 border rounded-md mb-4 md:mb-6 bg-muted/30">
                  <h3 className="text-lg font-semibold">Add New Address</h3>
                  <div><Label htmlFor="addrName">Address Label (e.g., Home, Work)</Label><Input id="addrName" value={newAddress.name} onChange={e => handleAddressInputChange('name', e.target.value)} required className="text-base md:text-sm"/></div>
                  <div className="grid sm:grid-cols-2 gap-3 md:gap-4">
                    <div><Label htmlFor="addrFirstName">First Name</Label><Input id="addrFirstName" value={newAddress.firstName} onChange={e => handleAddressInputChange('firstName', e.target.value)} required className="text-base md:text-sm"/></div>
                    <div><Label htmlFor="addrLastName">Last Name</Label><Input id="addrLastName" value={newAddress.lastName} onChange={e => handleAddressInputChange('lastName', e.target.value)} required className="text-base md:text-sm"/></div>
                  </div>
                  <div><Label htmlFor="addrLine1">Address Line 1</Label><Input id="addrLine1" value={newAddress.addressLine1} onChange={e => handleAddressInputChange('addressLine1', e.target.value)} required className="text-base md:text-sm"/></div>
                  <div><Label htmlFor="addrCity">City</Label><Input id="addrCity" value={newAddress.city} onChange={e => handleAddressInputChange('city', e.target.value)} required className="text-base md:text-sm"/></div>
                  <div className="grid sm:grid-cols-2 gap-3 md:gap-4">
                  <div><Label htmlFor="addrPostalCode">Postal Code</Label><Input id="addrPostalCode" value={newAddress.postalCode} onChange={e => handleAddressInputChange('postalCode', e.target.value)} required className="text-base md:text-sm"/></div>
                  <div><Label htmlFor="addrPhone">Phone</Label><Input id="addrPhone" type="tel" value={newAddress.phone} onChange={e => handleAddressInputChange('phone', e.target.value)} required className="text-base md:text-sm"/></div>
                  </div>
                  <div className="flex items-center space-x-2"><Input type="checkbox" id="addrDefault" checked={!!newAddress.isDefault} onChange={e => handleAddressInputChange('isDefault', e.target.checked)} className="h-4 w-4" /><Label htmlFor="addrDefault">Set as default address</Label></div>
                  <Button type="submit" disabled={isAddingAddress}>{isAddingAddress && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Save Address</Button>
                </form>
              )}
              {isAddressesLoading ? <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                : userAddresses.length > 0 ? (
                  <div className="space-y-3 md:space-y-4">
                    {userAddresses.map(addr => (
                      <Card key={addr.id} className={`p-3 md:p-4 ${addr.isDefault ? 'border-primary ring-1 ring-primary' : ''}`}>
                        <h4 className="font-semibold text-sm md:text-base">{addr.name} {addr.isDefault && <span className="text-xs text-primary font-normal">(Default)</span>}</h4>
                        <p className="text-xs md:text-sm text-muted-foreground">{addr.firstName} {addr.lastName}</p>
                        <p className="text-xs md:text-sm text-muted-foreground">{addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ''}</p>
                        <p className="text-xs md:text-sm text-muted-foreground">{addr.city}, {addr.postalCode}</p>
                        <p className="text-xs md:text-sm text-muted-foreground">{addr.phone}</p>
                      </Card>
                    ))}
                  </div>
                ) : !showAddAddressForm && <p className="text-muted-foreground text-center py-10">You have no saved addresses.</p>}
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 md:mb-10">
          <User className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-primary mb-2 sm:mb-4" />
          <h1 className="text-3xl sm:text-4xl font-bold text-primary font-headline">My Account</h1>
        </div>
        
        <div className="md:hidden mb-6">
            <Sheet open={isMobileSheetOpen} onOpenChange={setIsMobileSheetOpen}>
                <SheetTrigger asChild>
                    <Button variant="outline" className="w-full">
                        <SlidersHorizontal className="mr-2 h-4 w-4" /> Profile Menu
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] p-0">
                    <ProfileSidebarContent />
                </SheetContent>
            </Sheet>
        </div>

        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 items-start">
          <div className="hidden md:block md:col-span-1 lg:col-span-1 sticky top-24">
             <ProfileSidebarContent />
          </div>
          <div className="md:col-span-2 lg:col-span-3">
            {renderSectionContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
