
import type { Metadata } from 'next';
import ProductCard from '@/components/features/home/product-card';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'My Wishlist - Creme Collections',
  description: 'View your saved items.',
};

const mockWishlistItems = [
    {
        id: '1', name: 'Modern Smartwatch Series X', description: 'Sleek smartwatch with advanced health tracking.',
        image: '/images/products/smartwatch_main.png', dataAiHint: 'smartwatch technology', fixedOfferPrice: 12999, fixedOriginalPrice: 15999,
        rating: '4.5', reviewsCount: 150,
    },
    {
        id: '3', name: 'Stainless Steel Cookware Set', description: 'Durable 10-piece cookware set.',
        image: '/images/products/cookware_set.png', dataAiHint: 'cookware kitchen', fixedOfferPrice: 7999, fixedOriginalPrice: 9500,
        rating: '4.8', reviewsCount: 210,
    },
];

export default function WishlistPage() {
  const hasItems = mockWishlistItems.length > 0;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 md:mb-8 gap-4">
        <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground font-headline flex items-center gap-3">
              <Heart className="w-8 h-8 text-primary" /> My Wishlist
            </h1>
            <p className="text-muted-foreground mt-1">Your collection of saved items.</p>
        </div>
      </div>

      {hasItems ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {mockWishlistItems.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <Heart className="mx-auto h-16 w-16 sm:h-20 sm:w-20 text-muted-foreground/30 mb-4 sm:mb-6" />
          <p className="text-lg sm:text-xl font-semibold text-foreground mb-2">Your wishlist is empty.</p>
          <p className="text-muted-foreground mb-4 sm:mb-6">
            See something you like? Save it here to come back to later.
          </p>
          <Button asChild size="lg">
            <Link href="/products">Start Shopping</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
