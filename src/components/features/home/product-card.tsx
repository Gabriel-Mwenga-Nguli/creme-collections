
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export interface ProductCardProps {
  id: string; // Changed from number to string
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

  useEffect(() => {
    if (fixedOfferPrice !== undefined) { // Check only for offerPrice for display logic
      setOfferPrice(fixedOfferPrice.toLocaleString('en-US'));
      if (fixedOriginalPrice !== undefined && fixedOriginalPrice > fixedOfferPrice) {
        setOriginalPrice(fixedOriginalPrice.toLocaleString('en-US'));
      } else {
        setOriginalPrice(null); // No discount or original price not higher
      }
    } else {
      // Fallback for products without explicit prices in props (e.g., from Firestore without these fields)
      // This part might be less relevant if all data comes from Firestore with prices
      const basePrice = Math.random() * 8000 + 2000; 
      const discount = Math.random() * 0.3 + 0.1;
      const calculatedOfferPrice = basePrice * (1 - discount);
      const calculatedOriginalPrice = basePrice;
      setOfferPrice(Math.round(calculatedOfferPrice).toLocaleString('en-US'));
      setOriginalPrice(Math.round(calculatedOriginalPrice).toLocaleString('en-US'));
    }
  }, [id, fixedOfferPrice, fixedOriginalPrice]);

  return (
    <Card className="overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl hover:border-primary h-full flex flex-col">
      <Link href={`/products/item/${id}`} className="group block flex flex-col flex-grow"> {/* Updated Link href */}
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
        <CardContent className="p-4 flex flex-col flex-grow">
          <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors font-headline">{name}</CardTitle>
          <CardDescription className="text-sm mt-1 h-10 overflow-hidden flex-shrink-0">{description}</CardDescription>
          <div className="mt-2 flex items-baseline gap-2">
            {offerPrice !== null ? (
              <>
                <p className="text-lg font-bold text-primary">
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
          <Button variant="outline" size="sm" className="w-full mt-auto">
            View Details
          </Button>
        </CardContent>
      </Link>
    </Card>
  );
}

    