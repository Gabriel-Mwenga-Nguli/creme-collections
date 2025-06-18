
"use client";

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'; 
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, Loader2, Eye } from 'lucide-react'; 
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import { auth, db } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, setDoc, deleteDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';

export interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  image: string;
  dataAiHint: string;
  fixedOfferPrice?: number;
  fixedOriginalPrice?: number;
}

export default function ProductCard({ id, name, description, image, dataAiHint, fixedOfferPrice, fixedOriginalPrice }: ProductCardProps) {
  const [offerPrice, setOfferPrice] = useState<string | null>(null);
  const [originalPrice, setOriginalPrice] = useState<string | null>(null);
  const { addToCart, getCartItemCount } = useCart(); 
  const { toast } = useToast();
  const [user, authLoading] = useAuthState(auth);

  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isWishlistProcessing, setIsWishlistProcessing] = useState(false);

  useEffect(() => {
    if (fixedOfferPrice !== undefined) {
      setOfferPrice(fixedOfferPrice.toLocaleString('en-US'));
      if (fixedOriginalPrice !== undefined && fixedOriginalPrice > fixedOfferPrice) {
        setOriginalPrice(fixedOriginalPrice.toLocaleString('en-US'));
      } else {
        setOriginalPrice(null);
      }
    } else {
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
  }, [user, id, authLoading, db]); 

  const handleAddToCart = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); 
    event.stopPropagation(); 
    const productToAdd = { id, name, description, image, dataAiHint, fixedOfferPrice, fixedOriginalPrice };
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
      setIsWishlistProcessing(false); 
    }
  };


  return (
    <Card className="overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl group/card h-full flex flex-col bg-card border border-border hover:border-primary/50">
      <div className="p-0 relative">
        <Link href={`/products/item/${id}`} className="block aspect-square overflow-hidden rounded-t-lg">
            <Image
              src={image}
              alt={name}
              width={400}
              height={400}
              className="object-cover w-full h-full group-hover/card:scale-105 transition-transform duration-300"
              data-ai-hint={dataAiHint}
            />
        </Link>
        <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleWishlist}
            disabled={authLoading || isWishlistProcessing}
            className="absolute top-2 right-2 z-10 bg-background/70 hover:bg-background/90 text-foreground hover:text-primary rounded-full h-8 w-8 sm:h-9 sm:w-9"
            aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
            {isWishlistProcessing ? (
                <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
            ) : (
                <Heart className={`h-4 w-4 sm:h-5 sm:w-5 ${isInWishlist ? 'fill-destructive text-destructive' : 'text-muted-foreground'}`} />
            )}
        </Button>
      </div>
      <CardContent className="p-3 sm:p-4 flex flex-col flex-grow">
        <Link href={`/products/item/${id}`} className="block mb-1">
            <CardTitle className="text-base md:text-lg font-semibold group-hover/card:text-primary transition-colors font-headline truncate leading-tight" title={name}>{name}</CardTitle>
        </Link>
        <div className="flex items-baseline gap-2 mb-2">
          {offerPrice !== null ? (
            <>
              <p className="text-lg md:text-xl font-bold text-primary">
                KES {offerPrice}
              </p>
              {originalPrice !== null && (
                <p className="text-xs md:text-sm text-muted-foreground line-through">
                  KES {originalPrice}
                </p>
              )}
            </>
          ) : (
            <p className="text-base md:text-lg font-bold text-primary">Price not available</p>
          )}
        </div>
        
        <div className="mt-auto space-y-2">
            <Button 
                variant="default" 
                size="sm" 
                className="w-full h-9 text-xs sm:text-sm" 
                onClick={handleAddToCart}
                disabled={fixedOfferPrice === undefined} 
            >
              <ShoppingCart className="mr-1.5 h-4 w-4" /> Add to Cart
            </Button>
            <Button asChild variant="outline" size="sm" className="w-full h-9 text-xs sm:text-sm">
              <Link href={`/products/item/${id}`}>
                <Eye className="mr-1.5 h-4 w-4 inline" />View Details
              </Link>
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
