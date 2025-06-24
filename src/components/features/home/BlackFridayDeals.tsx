
"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ProductCard, { type ProductCardProps } from './product-card';
import { Button } from '@/components/ui/button';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface BlackFridayDealsProps {
  deals: ProductCardProps[];
}

const BlackFridayBannerCard = () => (
  <div className="w-64 sm:w-72 shrink-0 h-full">
    <Card className="relative overflow-hidden bg-slate-900 h-full flex flex-col rounded-xl shadow-2xl border-primary/50">
        <Image
            src="/images/banners/black-friday.png"
            alt="Black Friday Sale"
            fill
            sizes="(max-width: 768px) 50vw, 288px"
            className="object-cover z-0 opacity-50"
            data-ai-hint="black friday sale"
        />
        <CardContent className="relative z-10 flex flex-col items-center justify-center text-center p-6 flex-grow text-white">
            <h3 className="text-4xl font-extrabold font-headline uppercase leading-none drop-shadow-lg">Black Friday</h3>
            <p className="text-2xl font-bold text-primary drop-shadow-lg mb-4">Live Now</p>
            <p className="text-slate-300 text-sm mb-6">Unbeatable prices on top products. Don't miss out!</p>
            <Button asChild variant="default" size="lg">
                <Link href="/products">
                    Shop All Deals <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
            </Button>
        </CardContent>
    </Card>
  </div>
);


const BlackFridayDeals: React.FC<BlackFridayDealsProps> = ({ deals }) => {
  if (!deals || deals.length === 0) {
    return null;
  }

  const items = [<BlackFridayBannerCard key="banner" />, ...deals.map(deal => (
    <div key={deal.id} className="w-64 sm:w-72 shrink-0 h-full">
      <ProductCard {...deal} />
    </div>
  ))];

  return (
    <section className="py-10 md:py-16 bg-slate-900 text-white animate-in fade-in-0 duration-700">
      <div className="container mx-auto px-0 sm:px-6 lg:px-8">
         <div className="px-4 sm:px-0 mb-6 text-center">
            <h2 className="text-3xl font-bold font-headline text-primary">Top Black Friday Deals</h2>
            <p className="text-slate-300">Don't miss out on these limited-time offers!</p>
        </div>
        <div className="relative w-full overflow-hidden group">
            <div className="flex">
                <div className="flex min-w-full shrink-0 animate-scroll-left group-hover:animation-pause">
                  {items.map((item, index) => <div key={index} className="flex-shrink-0 px-2">{item}</div>)}
                </div>
                <div className="flex min-w-full shrink-0 animate-scroll-left group-hover:animation-pause">
                  {items.map((item, index) => <div key={index + items.length} className="flex-shrink-0 px-2">{item}</div>)}
                </div>
            </div>
             <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-slate-900 to-transparent pointer-events-none"></div>
            <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-slate-900 to-transparent pointer-events-none"></div>
        </div>
      </div>
    </section>
  );
};

export default BlackFridayDeals;
