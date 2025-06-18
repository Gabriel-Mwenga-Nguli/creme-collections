
"use client";

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, Loader2 } from 'lucide-react';
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
  const { addToCart } = useCart();
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
  }, [user, id, authLoading]);

  const handleAddToCart = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); // Prevent link navigation if card is wrapped in Link
    event.stopPropagation(); // Stop event from bubbling up
    const productToAdd = { id, name, description, image, dataAiHint, fixedOfferPrice, fixedOriginalPrice };
    addToCart(productToAdd, 1); // Add 1 quantity by default from card
  };

  const handleToggleWishlist = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (!user) {
      toast({ title: "Login Required", description: "Please log in to manage your wishlist.", variant: "destructive", action: <Button asChild><Link href="/login">Login</Link></Button> });
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
       // setIsWishlistProcessing(false); // Snapshot listener will set this
    }
  };


  return (
    <Card className="overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl group/card h-full flex flex-col">
      <CardHeader className="p-0 relative">
        <Link href={`/products/item/${id}`} className="block aspect-square">
            <Image
              src={image}
              alt={name}
              width={400}
              height={400}
              className="object-cover w-full h-full group-hover/card:opacity-80 transition-opacity"
              data-ai-hint={dataAiHint}
            />
        </Link>
        <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleWishlist}
            disabled={authLoading || isWishlistProcessing}
            className="absolute top-2 right-2 z-10 bg-background/60 hover:bg-background/90 text-foreground hover:text-primary rounded-full h-9 w-9 opacity-80 group-hover/card:opacity-100 transition-opacity"
            aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
            {isWishlistProcessing ? (
                <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
                <Heart className={`h-5 w-5 ${isInWishlist ? 'fill-destructive text-destructive' : 'text-muted-foreground'}`} />
            )}
        </Button>
      </CardHeader>
      <CardContent className="p-4 flex flex-col flex-grow">
        <Link href={`/products/item/${id}`} className="block">
            <CardTitle className="text-lg font-semibold group-hover/card:text-primary transition-colors font-headline truncate" title={name}>{name}</CardTitle>
            <CardDescription className="text-sm mt-1 h-10 overflow-hidden text-ellipsis">
            {description.length > 60 ? `${description.substring(0, 60)}...` : description}
            </CardDescription>
        </Link>
        <div className="mt-2 flex items-baseline gap-2">
          {offerPrice !== null ? (
            <>
              <p className="text-xl font-bold text-primary">
                KES {offerPrice}
              </p>
              {originalPrice !== null && (
                <p className="text-sm text-muted-foreground line-through">
                  KES {originalPrice}
                </p>
              )}
            </>
          ) : (
            <p className="text-lg font-bold text-primary">Price not available</p>
          )}
        </div>
        
        <div className="mt-auto pt-3 space-y-2">
            <Button 
                variant="default" 
                size="sm" 
                className="w-full" 
                onClick={handleAddToCart}
                disabled={fixedOfferPrice === undefined} // Disable if no price
            >
              <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
            </Button>
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link href={`/products/item/${id}`}>View Details</Link>
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
