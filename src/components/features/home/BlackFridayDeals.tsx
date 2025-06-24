"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ProductCard, { type ProductCardProps } from './product-card';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';

interface BlackFridayDealsProps {
  deals: ProductCardProps[];
}

const BlackFridayDeals: React.FC<BlackFridayDealsProps> = ({ deals }) => {
  if (!deals || deals.length === 0) {
    return null; // Don't render the section if there are no deals
  }

  // Take the first 2 deals for a cleaner, more balanced look
  const featuredDeals = deals.slice(0, 2);

  return (
    <section className="py-10 md:py-16 bg-slate-900 text-white animate-in fade-in-0 slide-in-from-bottom-12 duration-700 ease-out">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-12 gap-6 md:gap-8 items-center">
          {/* Left: Banner */}
          <div className="md:col-span-4 lg:col-span-4 flex flex-col justify-center items-center bg-black rounded-xl shadow-2xl p-4 md:p-0">
            <Link href="/products" className="block w-full">
              <div className="relative aspect-square w-full overflow-hidden rounded-lg group">
                <Image
                  src="/images/banners/black-friday.png"
                  alt="Black Friday Sale Banner"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  data-ai-hint="black friday sale"
                  priority 
                />
              </div>
            </Link>
          </div>

          {/* Right: Product Grid */}
          <div className="md:col-span-8 lg:col-span-8 flex flex-col justify-center">
            {/* Title for the product section */}
            <div className="mb-4 text-center md:text-left">
              <h2 className="text-3xl font-bold font-headline text-primary">Top Black Friday Deals</h2>
              <p className="text-slate-300">Don't miss out on these limited-time offers!</p>
            </div>
            
            {/* Grid for product cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              {featuredDeals.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>

            {/* "Shop All" button */}
            <div className="text-center mt-6">
              <Button asChild variant="default" size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/products">
                  Shop All Deals <ShoppingBag className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlackFridayDeals;