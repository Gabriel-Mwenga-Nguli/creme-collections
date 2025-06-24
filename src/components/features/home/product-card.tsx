
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Eye, Star } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

export interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  image: string;
  dataAiHint: string;
  fixedOfferPrice?: number;
  fixedOriginalPrice?: number;
  rating?: string | number;
  reviewsCount?: number;
}

export default function ProductCard({ id, name, description, image, dataAiHint, fixedOfferPrice, fixedOriginalPrice, rating, reviewsCount }: ProductCardProps) {
  const { addToCart } = useCart();
  const router = useRouter();

  const numericRating = parseFloat(String(rating || 0));
  const displayRating = numericRating > 0 ? numericRating.toFixed(1) : null;
  const displayReviewsCount = reviewsCount && reviewsCount > 0 ? reviewsCount : null;

  const handleAddToCart = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const productToAdd = { id, name, description, image, dataAiHint, fixedOfferPrice, fixedOriginalPrice, rating, reviewsCount };
    addToCart(productToAdd, 1);
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
          {fixedOfferPrice !== undefined ? (
            <>
              <p className="text-xl md:text-2xl font-bold text-primary">
                KES {fixedOfferPrice.toLocaleString('en-US')}
              </p>
              {fixedOriginalPrice !== undefined && fixedOriginalPrice > fixedOfferPrice && (
                <p className="text-sm md:text-base text-muted-foreground line-through">
                  KES {fixedOriginalPrice.toLocaleString('en-US')}
                </p>
              )}
            </>
          ) : (
            <p className="text-lg md:text-xl font-bold text-primary">Price not available</p>
          )}
        </div>
        
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
