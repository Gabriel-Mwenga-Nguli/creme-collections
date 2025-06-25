
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Heart, Loader2, ShoppingBag } from 'lucide-react';
import type { Metadata } from 'next';
import { useAuth } from '@/context/AuthContext';
import ProductCard from '@/components/features/home/product-card';

// export const metadata: Metadata = { // This needs to be static or moved to layout
//   title: 'My Wishlist - Creme Collections',
//   description: 'Your favorite items saved for later.',
// };

// Mock data, in a real app this would come from user's profile in Firestore
const mockWishlistItems = [
    {
        id: '7', name: 'Elegant Evening Gown', description: 'A stunning dress for special occasions.',
        image: 'https://placehold.co/600x400.png', dataAiHint: 'woman dress',
        fixedOfferPrice: 8999, fixedOriginalPrice: 11000, rating: '4.9', reviewsCount: 45,
    },
    {
        id: '8', name: 'Espresso Coffee Maker', description: 'Barista-quality coffee at home.',
        image: 'https://placehold.co/600x400.png', dataAiHint: 'coffee machine',
        fixedOfferPrice: 15999, fixedOriginalPrice: 18000, rating: '4.7', reviewsCount: 92,
    },
];

export default function WishlistPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-10rem)] px-4 py-12">
        <Card className="max-w-md w-full text-center shadow-lg">
          <CardHeader>
            <Heart className="mx-auto h-12 w-12 text-primary" />
            <CardTitle className="mt-4 text-2xl font-bold">Your Wishlist</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Please log in to view your wishlist and save your favorite items.
            </CardDescription>
            <Button asChild className="mt-6">
              <Link href="/login">Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="mb-6 md:mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-foreground font-headline flex items-center gap-3">
          <Heart className="w-8 h-8 text-primary" />
          My Wishlist
        </h1>
        <p className="text-muted-foreground mt-1">Your saved items for later.</p>
      </div>

      {mockWishlistItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {mockWishlistItems.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <Heart className="mx-auto h-16 w-16 text-muted-foreground/30 mb-4" />
          <p className="text-lg font-semibold text-foreground mb-2">Your wishlist is empty.</p>
          <p className="text-muted-foreground mb-6">
            Add items you love to your wishlist to save them for later.
          </p>
          <Button asChild size="lg">
            <Link href="/products">
              <ShoppingBag className="mr-2 h-5 w-5" /> Start Shopping
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
