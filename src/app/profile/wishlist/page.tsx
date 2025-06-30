
"use client";

import { useAuth } from '@/context/AuthContext';
import { Loader2, Heart, ShoppingBag } from 'lucide-react';
import ProductCard from '@/components/features/home/product-card';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

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
    {
        id: '4', name: 'Wireless Noise-Cancelling Headphones', description: 'Immersive audio experience, free from distractions.',
        image: '/images/products/headphones.png', dataAiHint: 'audio headphones',
        fixedOfferPrice: 19999, fixedOriginalPrice: 24000, rating: '4.9', reviewsCount: 350,
    }
];

export default function ProfileWishlistPage() {
    const { user, isLoading } = useAuth();
    
    // In a real app, you would fetch the user's wishlist here.
    const wishlistItems = mockWishlistItems; 

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }
    
    // This case is handled by the layout, but it's good practice.
    if (!user) {
        return (
             <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Access Denied</CardTitle>
                    <CardDescription>Please log in to view your wishlist.</CardDescription>
                </CardHeader>
             </Card>
        );
    }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-headline flex items-center">
            <Heart className="mr-3 h-6 w-6 text-primary" /> My Wishlist
        </CardTitle>
        <CardDescription>Your saved items for later. Click an item to view its details.</CardDescription>
      </CardHeader>
      <CardContent>
        {wishlistItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {wishlistItems.map((item) => (
                    <ProductCard key={item.id} {...item} />
                ))}
            </div>
        ) : (
            <div className="text-center py-16 border-2 border-dashed rounded-lg">
                <Heart className="mx-auto h-16 w-16 text-muted-foreground/30 mb-4" />
                <p className="text-lg font-semibold text-foreground mb-2">Your wishlist is empty.</p>
                <p className="text-muted-foreground mb-6">
                    Add items you love by clicking the heart icon on a product.
                </p>
                <Button asChild size="lg">
                    <Link href="/products">
                        <ShoppingBag className="mr-2 h-5 w-5" /> Start Shopping
                    </Link>
                </Button>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
