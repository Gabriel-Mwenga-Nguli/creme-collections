"use client";

import { useRef, useState, useEffect, useCallback } from 'react';
import ProductCard, { type ProductCardProps } from './product-card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface FeaturedProductsSliderProps {
  products: ProductCardProps[];
}

const FeaturedProductsSlider: React.FC<FeaturedProductsSliderProps> = ({ products }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
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
  }, [products, updateScrollability]);

  const advanceSlide = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container || !canScroll) return;

    const firstCardWrapper = container.querySelector('div.snap-center') as HTMLElement;
    if (!firstCardWrapper) return;

    const cardWidth = firstCardWrapper.offsetWidth; 
    const gap = 16; // Corresponds to space-x-4 (1rem)
    const scrollStep = cardWidth + gap; 

    const { scrollLeft, scrollWidth, clientWidth } = container;
    const maxScrollLeft = scrollWidth - clientWidth;

    if (maxScrollLeft <= 1) return; 

    let nextScrollPosition = scrollLeft + scrollStep;

    if (scrollLeft >= maxScrollLeft - (gap/2) ) { 
        nextScrollPosition = 0; 
    } else if (nextScrollPosition > maxScrollLeft) {
        nextScrollPosition = maxScrollLeft; 
    }
    
    container.scrollTo({ left: nextScrollPosition, behavior: 'smooth' });
  }, [canScroll]);

  useEffect(() => {
    if (canScroll && !isHovering && products.length > 1) {
      intervalRef.current = setInterval(advanceSlide, 6000); // Slightly different timing
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [canScroll, isHovering, advanceSlide, products.length]);

  const manualScroll = useCallback((direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container || !canScroll) return;

    const firstCardWrapper = container.querySelector('div.snap-center') as HTMLElement;
    if (!firstCardWrapper) return;
    const cardWidth = firstCardWrapper.offsetWidth;
    const gap = 16;
    const scrollAmount = cardWidth + gap;

    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (canScroll && !isHovering && products.length > 1) {
       intervalRef.current = setInterval(advanceSlide, 8000); 
    }
  }, [canScroll, isHovering, advanceSlide, products.length]);
  
  const showButtons = canScroll && products.length > 1;

  if (!products || products.length === 0) {
    return (
        <div className="text-center py-8 text-muted-foreground">
            <p>No featured products available at the moment. Check back soon!</p>
        </div>
    );
  }

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto space-x-4 py-4 scrollbar-hide scroll-smooth -mx-2 px-2"
      >
        {products.map((product) => (
          <div key={product.id} className="snap-center shrink-0 w-64 sm:w-72 md:w-80">
            <ProductCard
              id={product.id}
              name={product.name}
              description={product.description}
              image={product.image}
              dataAiHint={product.dataAiHint}
              fixedOfferPrice={product.fixedOfferPrice}
              fixedOriginalPrice={product.fixedOriginalPrice}
              rating={product.rating}
              reviewsCount={product.reviewsCount}
            />
          </div>
        ))}
      </div>
      {showButtons && (
        <>
          <Button
            variant="outline"
            size="icon"
            onClick={() => manualScroll('left')}
            aria-label="Scroll left"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/50 hover:bg-background/90 rounded-full shadow-md h-10 w-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 focus:opacity-100"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => manualScroll('right')}
            aria-label="Scroll right"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/50 hover:bg-background/90 rounded-full shadow-md h-10 w-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 focus:opacity-100"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </>
      )}
    </div>
  );
};

export default FeaturedProductsSlider;
