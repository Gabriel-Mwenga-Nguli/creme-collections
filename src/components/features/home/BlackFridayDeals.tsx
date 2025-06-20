
"use client";

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ProductCard, { type ProductCardProps } from './product-card';
import { Button } from '@/components/ui/button';
import { ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const dummyBlackFridayProducts: ProductCardProps[] = [
  { id: 'bf001', name: 'UltraHD 4K Smart TV', description: 'Experience stunning visuals with this 55-inch 4K TV.', image: 'https://placehold.co/600x400.png', dataAiHint: 'smart tv electronics', fixedOfferPrice: 45999, fixedOriginalPrice: 65000 },
  { id: 'bf002', name: 'Pro Gaming Laptop', description: 'High-performance laptop for serious gamers.', image: 'https://placehold.co/600x400.png', dataAiHint: 'gaming laptop', fixedOfferPrice: 89999, fixedOriginalPrice: 120000 },
  { id: 'bf003', name: 'Designer Leather Handbag', description: 'Elegant and stylish handbag for all occasions.', image: 'https://placehold.co/600x400.png', dataAiHint: 'leather handbag fashion', fixedOfferPrice: 7500, fixedOriginalPrice: 12500 },
  { id: 'bf004', name: 'Noise-Cancelling Headphones', description: 'Immersive audio experience, block out distractions.', image: 'https://placehold.co/600x400.png', dataAiHint: 'headphones audio', fixedOfferPrice: 8999, fixedOriginalPrice: 15000 },
  { id: 'bf005', name: 'Smart Fitness Watch', description: 'Track your fitness goals with this advanced smartwatch.', image: 'https://placehold.co/600x400.png', dataAiHint: 'smartwatch fitness', fixedOfferPrice: 6500, fixedOriginalPrice: 9999 },
  { id: 'bf006', name: 'Robotic Vacuum Cleaner', description: 'Keep your home spotless effortlessly.', image: 'https://placehold.co/600x400.png', dataAiHint: 'vacuum cleaner home', fixedOfferPrice: 18000, fixedOriginalPrice: 25000 },
  { id: 'bf007', name: 'Premium Coffee Maker', description: 'Brew delicious coffee like a pro.', image: 'https://placehold.co/600x400.png', dataAiHint: 'coffee maker kitchen', fixedOfferPrice: 5500, fixedOriginalPrice: 8000 },
  { id: 'bf008', name: 'Air Purifier Pro', description: 'Breathe cleaner air at home.', image: 'https://placehold.co/600x400.png', dataAiHint: 'air purifier appliance', fixedOfferPrice: 12000, fixedOriginalPrice: 17500 },
];

const BlackFridayDeals: React.FC = () => {
  const duplicatedProducts = [...dummyBlackFridayProducts, ...dummyBlackFridayProducts];
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
  }, [duplicatedProducts, updateScrollability]);

  const manualScroll = useCallback((direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container || !canScroll) return;

    const firstCardItem = container.querySelector('div.flex-none') as HTMLElement;
    if (!firstCardItem) return;

    // Card width + gap (px-2 on each side of card item = 0.5rem + 0.5rem = 1rem = 16px total gap)
    const cardWidth = firstCardItem.offsetWidth;
    const gap = 16; 
    const scrollAmount = cardWidth + gap;

    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  }, [canScroll]);

  const showButtons = canScroll && isHovering;

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
                  className="object-contain group-hover:scale-105 transition-transform duration-500"
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
              {/* Edge fades for better visual integration */}
              <div className="absolute inset-y-0 left-0 w-10 md:w-16 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent pointer-events-none"></div>
              <div className="absolute inset-y-0 right-0 w-10 md:w-16 bg-gradient-to-l from-slate-900 via-slate-900/80 to-transparent pointer-events-none"></div>

              {/* Scroll Buttons */}
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
             <div className="text-center mt-6 md:hidden"> {/* Show button on mobile */}
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
