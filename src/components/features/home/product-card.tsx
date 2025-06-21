
"use client";

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, Loader2, Eye, Star } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import { auth, db } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, setDoc, deleteDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  image: string;
  dataAiHint: string;
  fixedOfferPrice?: number;
  fixedOriginalPrice?: number;
  rating?: string | number; // Optional rating
  reviewsCount?: number; // Optional reviews count
}

export default function ProductCard({ id, name, description, image, dataAiHint, fixedOfferPrice, fixedOriginalPrice, rating, reviewsCount }: ProductCardProps) {
  const [offerPrice, setOfferPrice] = useState<string | null>(null);
  const [originalPrice, setOriginalPrice] = useState<string | null>(null);
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [user, authLoading] = useAuthState(auth);
  const router = useRouter();

  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isWishlistProcessing, setIsWishlistProcessing] = useState(false);

  const numericRating = parseFloat(String(rating || 0));
  const displayRating = numericRating > 0 ? numericRating.toFixed(1) : null;
  const displayReviewsCount = reviewsCount && reviewsCount > 0 ? reviewsCount : null;


  useEffect(() => {
    if (fixedOfferPrice !== undefined) {
      setOfferPrice(fixedOfferPrice.toLocaleString('en-US'));
      if (fixedOriginalPrice !== undefined && fixedOriginalPrice > fixedOfferPrice) {
        setOriginalPrice(fixedOriginalPrice.toLocaleString('en-US'));
      } else {
        setOriginalPrice(null);
      }
    } else {
      // Fallback if prices aren't fixed (though they should be for ProductCardProps)
      const basePrice = Math.random() * 8000 + 2000;
      const discount = Math.random() * 0.3 + 0.1;
      const calculatedOfferPrice = basePrice * (1 - discount);
      const calculatedOriginalPrice = basePrice;
      setOfferPrice(Math.round(calculatedOfferPrice).toLocaleString('en-US'));
      setOriginalPrice(Math.round(calculatedOriginalPrice).toLocaleString('en-US'));
    }
  }, [id, fixedOfferPrice, fixedOriginalPrice]);

  useEffect(() => {
    if (!user || !id || !db || authLoading) {
      if(!authLoading && user) setIsWishlistProcessing(false);
      return;
    }
    setIsWishlistProcessing(true);
    const wishlistItemRef = doc(db, 'users', user.uid, 'wishlist', id);
    const unsubscribe = onSnapshot(wishlistItemRef, (docSnap) => {
      setIsInWishlist(docSnap.exists());
      setIsWishlistProcessing(false);
    }, (error) => {
      console.error("Error checking wishlist status for product card:", error);
      setIsWishlistProcessing(false);
    });
    return () => unsubscribe();
  }, [user, id, authLoading]);

  const handleAddToCart = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const productToAdd = { id, name, description, image, dataAiHint, fixedOfferPrice, fixedOriginalPrice, rating, reviewsCount };
    addToCart(productToAdd, 1);
  };

  const handleToggleWishlist = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to manage your wishlist.",
        variant: "destructive",
        action: (
          <Button asChild variant="outline" size="sm">
            <Link href="/login">Login</Link>
          </Button>
        )
      });
      return;
    }
    if (!id || !db) {
      toast({ title: "Error", description: "Product data missing or database unavailable.", variant: "destructive" });
      return;
    }

    setIsWishlistProcessing(true);
    const wishlistItemRef = doc(db, 'users', user.uid, 'wishlist', id);

    try {
      if (isInWishlist) {
        await deleteDoc(wishlistItemRef);
        toast({ title: "Removed from Wishlist", description: `${name} removed from your wishlist.` });
      } else {
        await setDoc(wishlistItemRef, {
          productId: id,
          addedAt: serverTimestamp(),
          name: name,
          image: image,
          offerPrice: fixedOfferPrice,
        });
        toast({ title: "Added to Wishlist!", description: `${name} added to your wishlist.` });
      }
    } catch (error) {
      console.error("Error toggling wishlist from product card:", error);
      toast({ title: "Error", description: "Could not update your wishlist. Please try again.", variant: "destructive" });
    } finally {
        // isWishlistProcessing will be set to false by the onSnapshot listener
    }
  };


  return (
    <Card className="overflow-hidden transition-all duration-300 ease-in-out hover:shadow-2xl group/card h-full flex flex-col bg-card border border-border hover:border-primary/50 rounded-xl hover:scale-[1.03]">
      <div className="p-0 relative">
        <Link href={`/products/item/${id}`} className="block aspect-square overflow-hidden rounded-t-xl">
            <Image
              src={image}
              alt={name}
              width={400}
              height={400}
              className="object-cover w-full h-full group-hover/card:scale-110 transition-transform duration-500 ease-out"
              data-ai-hint={dataAiHint}
            />
        </Link>
        <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleWishlist}
            disabled={authLoading || isWishlistProcessing}
            className="absolute top-3 right-3 z-10 bg-background/70 hover:bg-background/90 text-foreground hover:text-primary rounded-full h-9 w-9 shadow-md transition-all hover:scale-110 active:scale-95"
            aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
            {isWishlistProcessing ? (
                <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
                <Heart className={`h-5 w-5 ${isInWishlist ? 'fill-destructive text-destructive' : 'text-muted-foreground'}`} />
            )}
        </Button>
      </div>
      <CardContent className="p-4 flex flex-col flex-grow">
        <Link href={`/products/item/${id}`} className="block mb-1.5">
            <CardTitle className="text-lg md:text-xl font-semibold group-hover/card:text-primary transition-colors font-headline truncate leading-snug" title={name}>{name}</CardTitle>
        </Link>
        
        {displayRating && (
          <div className="flex items-center gap-1 mb-1.5 text-xs text-muted-foreground">
            <Star className="w-3.5 h-3.5 text-accent fill-accent" />
            <span>{displayRating}</span>
            {displayReviewsCount && <span>({displayReviewsCount} reviews)</span>}
          </div>
        )}

        <div className="flex items-baseline gap-2 mb-3">
          {offerPrice !== null ? (
            <>
              <p className="text-xl md:text-2xl font-bold text-primary">
                KES {offerPrice}
              </p>
              {originalPrice !== null && (
                <p className="text-sm md:text-base text-muted-foreground line-through">
                  KES {originalPrice}
                </p>
              )}
            </>
          ) : (
            <p className="text-lg md:text-xl font-bold text-primary">Price not available</p>
          )}
        </div>
        
        {/* Interactive buttons appear on hover */}
        <div className="mt-auto space-y-2 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 group-hover/card:translate-y-0 translate-y-4">
            <Button
                variant="default"
                size="sm"
                className="w-full h-10 text-sm"
                onClick={handleAddToCart}
                disabled={fixedOfferPrice === undefined}
            >
              <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
            </Button>
            <Button asChild variant="outline" size="sm" className="w-full h-10 text-sm">
              <Link href={`/products/item/${id}`}>
                <Eye className="mr-2 h-4 w-4" />View Details
              </Link>
            </Button>
        </div>
         {/* Static button visible when not hovered, for touch devices or initial view */}
        <div className="mt-auto space-y-2 group-hover/card:hidden">
             <Button
                variant="outline"
                size="sm"
                className="w-full h-10 text-sm border-primary/30 text-primary/80 hover:bg-primary/10 hover:text-primary"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); router.push(`/products/item/${id}`); }}
            >
              <Eye className="mr-2 h-4 w-4" /> View Product
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
