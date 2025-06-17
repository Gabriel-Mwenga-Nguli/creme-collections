
import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import ProductCard from '@/components/features/home/product-card';

export const metadata: Metadata = {
  title: 'Your Wishlist - Creme Lite',
  description: 'Manage your favorite items on Creme Lite.',
};

// Dummy data for wishlist items - ID is now string
const wishlistItems = [
  { id: "ws301", name: "Stylish Smart Watch", description: "A beautiful watch you saved.", image: "https://placehold.co/400x400.png", dataAiHint: "smartwatch fashion", fixedOfferPrice: 12000, fixedOriginalPrice: 15000 },
  { id: "ws302", name: "Comfortable Sneakers", description: "Those shoes you liked.", image: "https://placehold.co/400x400.png", dataAiHint: "shoes footwear", fixedOfferPrice: 4500, fixedOriginalPrice: 5000 },
];
// In a real app, these would be fetched based on user's saved wishlist items from Firestore.

export default function WishlistPage() {
  // For now, using dummy data.
  // TODO: Implement fetching wishlist items from user data in Firestore.
  const currentWishlistItems = wishlistItems;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="text-center mb-10">
        <Heart className="mx-auto h-12 w-12 text-primary mb-4" />
        <h1 className="text-4xl font-bold text-primary font-headline">Your Wishlist</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Here are the items you've saved for later.
        </p>
      </div>

      {currentWishlistItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {currentWishlistItems.map((item) => (
            <ProductCard
              key={item.id}
              id={item.id} // ID is string
              name={item.name}
              description={item.description}
              image={item.image}
              dataAiHint={item.dataAiHint}
              fixedOfferPrice={item.fixedOfferPrice}
              fixedOriginalPrice={item.fixedOriginalPrice}
            />
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

    