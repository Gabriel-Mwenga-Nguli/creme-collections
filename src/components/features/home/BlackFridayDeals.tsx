
"use client";

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ProductCard, { type ProductCardProps } from './product-card';
import { Button } from '@/components/ui/button';
import { ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BlackFridayDealsProps {
  deals: ProductCardProps[];
}

const BlackFridayDeals: React.FC<BlackFridayDealsProps> = ({ deals }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [canScroll, setCanScroll] = useState(false);

  const updateScrollability = useCallback(() => {
    const container = scrollContainerRef.current;
    if (container) {
      setCanScroll(container.scrollWidth > container.clientWidth);
    }
  }, []);

  useEffect(() => {
    updateScrollability();
    window.addEventListener('resize', updateScrollability);
    
    const container = scrollContainerRef.current;
    if (container) {
      const observer = new MutationObserver(updateScrollability);
      observer.observe(container, { childList: true, subtree: true });
      return () => {
        window.removeEventListener('resize', updateScrollability);
        observer.disconnect();
      };
    }
    return () => window.removeEventListener('resize', updateScrollability);
  }, [updateScrollability]);

  const manualScroll = useCallback((direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container || !canScroll) return;

    const firstCardItem = container.querySelector('div.flex-none') as HTMLElement;
    if (!firstCardItem) return;

    const cardWidth = firstCardItem.offsetWidth;
    const gap = 16; 
    const scrollAmount = cardWidth + gap;

    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  }, [canScroll]);

  const showButtons = canScroll && isHovering;

  if (!deals || deals.length === 0) {
    return null; // Don't render the section if there are no deals
  }

  const duplicatedProducts = [...deals, ...deals];

  return (
    <section className="py-10 md:py-16 bg-slate-900 text-white animate-in fade-in-0 slide-in-from-bottom-12 duration-700 ease-out">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-12 gap-6 md:gap-8 items-center">
          {/* Left: Banner */}
          <div className="md:col-span-4 lg:col-span-3 flex flex-col justify-center items-center bg-black rounded-xl shadow-2xl p-4 md:p-0">
            <Link href="/products?filter=black-friday" className="block w-full">
              <div className="relative aspect-[1/1] w-full overflow-hidden rounded-lg group">
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

          {/* Right: Product Slider */}
          <div 
            className="md:col-span-8 lg:col-span-9 overflow-hidden relative flex flex-col justify-center"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <div className="relative w-full overflow-hidden group/slider">
              <div
                ref={scrollContainerRef}
                className="flex animate-scroll-rtl group-hover/slider:animation-pause py-4 scrollbar-hide scroll-smooth" 
              >
                {duplicatedProducts.map((product, index) => (
                  <div key={`${product.id}-${index}`} className="flex-none w-60 sm:w-64 md:w-72 px-2">
                    <ProductCard {...product} />
                  </div>
                ))}
              </div>
              <div className="absolute inset-y-0 left-0 w-10 md:w-16 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent pointer-events-none"></div>
              <div className="absolute inset-y-0 right-0 w-10 md:w-16 bg-gradient-to-l from-slate-900 via-slate-900/80 to-transparent pointer-events-none"></div>

              {showButtons && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => manualScroll('left')}
                    aria-label="Scroll left"
                    className="absolute left-1 top-1/2 -translate-y-1/2 z-20 bg-background/30 hover:bg-background/70 text-white rounded-full shadow-lg h-9 w-9 sm:h-10 sm:w-10 border-slate-700 hover:border-primary opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300 focus:opacity-100"
                  >
                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => manualScroll('right')}
                    aria-label="Scroll right"
                    className="absolute right-1 top-1/2 -translate-y-1/2 z-20 bg-background/30 hover:bg-background/70 text-white rounded-full shadow-lg h-9 w-9 sm:h-10 sm:w-10 border-slate-700 hover:border-primary opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300 focus:opacity-100"
                  >
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                  </Button>
                </>
              )}
            </div>
             <div className="text-center mt-6 md:hidden">
                <Button asChild variant="default" size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Link href="/products?filter=black-friday">
                        Shop All Black Friday Deals <ShoppingBag className="ml-2 h-5 w-5" />
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
