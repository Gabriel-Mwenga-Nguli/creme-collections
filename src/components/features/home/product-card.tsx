
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  id: number;
  name: string;
  description: string;
  image: string;
  dataAiHint: string;
}

export default function ProductCard({ id, name, description, image, dataAiHint }: ProductCardProps) {
  const [offerPrice, setOfferPrice] = useState<string | null>(null);
  const [originalPrice, setOriginalPrice] = useState<string | null>(null);

  useEffect(() => {
    // Generate prices on client-side to avoid hydration mismatch
    const basePrice = Math.random() * 8000 + 2000; // Base price between KES 2000 and KES 10000
    const discount = Math.random() * 0.3 + 0.1; // Discount between 10% and 40%
    
    const calculatedOfferPrice = basePrice * (1 - discount);
    const calculatedOriginalPrice = basePrice;

    setOfferPrice(calculatedOfferPrice.toFixed(0));
    setOriginalPrice(calculatedOriginalPrice.toFixed(0));
  }, [id]); // Re-calculate if id changes, though likely stable

  return (
    <Card className="overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl hover:border-primary">
      <Link href={`/products/item/product-${id}`} className="group block">
        <CardHeader className="p-0">
          <div className="aspect-square">
            <Image 
              src={image} 
              alt={name} 
              width={400} 
              height={400} 
              className="object-cover w-full h-full group-hover:opacity-90 transition-opacity" 
              data-ai-hint={dataAiHint} 
            />
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors font-headline">{name}</CardTitle>
          <CardDescription className="text-sm mt-1 h-10 overflow-hidden">{description}</CardDescription>
          <div className="mt-2 flex items-baseline gap-2">
            {offerPrice !== null ? (
              <>
                <p className="text-lg font-bold text-primary">
                  KES {offerPrice}
                </p>
                {originalPrice !== null && offerPrice !== originalPrice && (
                  <p className="text-sm text-muted-foreground line-through">
                    KES {originalPrice}
                  </p>
                )}
              </>
            ) : (
              <p className="text-lg font-bold text-primary">Loading price...</p>
            )}
          </div>
          <Button variant="outline" size="sm" className="w-full mt-3">
            View Details
          </Button>
        </CardContent>
      </Link>
    </Card>
  );
}
