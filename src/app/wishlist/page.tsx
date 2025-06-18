
"use client";

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Heart, Loader2, ShoppingCart, Trash2 } from 'lucide-react';
import ProductCard, { type ProductCardProps } from '@/components/features/home/product-card';
import { useToast } from '@/hooks/use-toast';
import { auth, db } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, query, getDocs, doc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { getProductDetailsById } from '@/services/productService';

export default function WishlistPage() {
  const [user, authLoading, authError] = useAuthState(auth);
  const { toast } = useToast();
  const [wishlistItems, setWishlistItems] = useState<ProductCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWishlistProducts = useCallback(async (productIds: string[]) => {
    if (!db) {
      console.error("Firestore (db) is not initialized. Cannot fetch wishlist products.");
      setIsLoading(false);
      toast({ title: "Error", description: "Database not available. Cannot load wishlist.", variant: "destructive" });
      return;
    }
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
      } else {
        console.warn(`Product details not found for wishlist item ID: ${productId}`);
      }
    }
    setWishlistItems(productsData);
    setIsLoading(false);
  }, [toast]); 

  useEffect(() => {
    document.title = 'Your Wishlist - Creme Collections';
    if (authLoading) {
      setIsLoading(true);
      return;
    }
    if (!user) {
      setIsLoading(false); 
      return;
    }
    if (!db) {
        console.error("Firestore (db) is not initialized. Cannot fetch wishlist.");
        setIsLoading(false);
        return;
    }

    setIsLoading(true);
    const wishlistRef = collection(db, 'users', user.uid, 'wishlist');
    const q = query(wishlistRef);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productIds = snapshot.docs.map(doc => doc.id); 
      fetchWishlistProducts(productIds);
    }, (error) => {
      console.error("Error fetching wishlist:", error);
      toast({ title: "Error", description: "Could not load your wishlist. Please try again.", variant: "destructive" });
      setIsLoading(false);
    });

    return () => unsubscribe(); 
  }, [user, authLoading, toast, fetchWishlistProducts]);

  const handleRemoveFromWishlist = async (productId: string) => {
    if (!user || !db) {
      toast({ title: "Error", description: "You must be logged in to modify your wishlist.", variant: "destructive" });
      return;
    }
    try {
      const wishlistItemRef = doc(db, 'users', user.uid, 'wishlist', productId);
      await deleteDoc(wishlistItemRef);
      toast({ title: "Removed from Wishlist", description: "The item has been removed from your wishlist." });
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast({ title: "Error", description: "Could not remove item from wishlist.", variant: "destructive" });
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (authError) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 text-center">
        <p className="text-destructive">Error loading your profile: {authError.message}</p>
        <Button asChild className="mt-4">
          <Link href="/login">Login</Link>
        </Button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 text-center">
        <Heart className="mx-auto h-20 w-20 text-muted-foreground/30 mb-6" />
        <p className="text-xl font-semibold text-foreground mb-2">Your Wishlist Awaits</p>
        <p className="text-muted-foreground mb-6">
          Please <Link href="/login" className="text-primary hover:underline">log in</Link> to view or add items to your wishlist.
        </p>
        <Button asChild size="lg">
          <Link href="/login">Login to View Wishlist</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="text-center mb-10">
        <Heart className="mx-auto h-12 w-12 text-primary mb-4" />
        <h1 className="text-4xl font-bold text-primary font-headline">Your Wishlist</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Here are the items you've saved for later.
        </p>
      </div>

      {wishlistItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {wishlistItems.map((item) => (
            <div key={item.id} className="relative group/wishlistitem">
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
                className="absolute top-2 right-2 opacity-0 group-hover/wishlistitem:opacity-100 transition-opacity z-10 h-8 w-8"
                onClick={() => handleRemoveFromWishlist(item.id)}
                aria-label="Remove from wishlist"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Heart className="mx-auto h-20 w-20 text-muted-foreground/30 mb-6" />
          <p className="text-xl font-semibold text-foreground mb-2">Your wishlist is currently empty.</p>
          <p className="text-muted-foreground mb-6">
            Add items you love to your wishlist by clicking the heart icon on product pages.
          </p>
          <Button asChild size="lg">
            <Link href="/products">Start Shopping</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
