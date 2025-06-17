
"use client";

import { useRef, useState, useEffect, useCallback } from 'react';
import ProductCard, { type ProductCardProps } from './product-card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface DealProduct extends ProductCardProps {
  fixedOfferPrice: number;
  fixedOriginalPrice: number;
}

interface WeeklyDealsSliderProps {
  deals: DealProduct[];
}

const WeeklyDealsSlider: React.FC<WeeklyDealsSliderProps> = ({ deals }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [canScroll, setCanScroll] = useState(false);

  useEffect(() => {
    if (scrollContainerRef.current) {
      const { scrollWidth, offsetWidth } = scrollContainerRef.current;
      setCanScroll(scrollWidth > offsetWidth);
    }
  }, [deals]); // Recalculate when deals change

  const advanceSlide = useCallback(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const { scrollLeft, scrollWidth, offsetWidth } = container;
      const maxScrollLeft = scrollWidth - offsetWidth;

      if (maxScrollLeft <= 0) return; // Not scrollable

      let targetScrollLeft = scrollLeft + offsetWidth; // Scroll by one full "page"

      if (targetScrollLeft >= maxScrollLeft) {
        // If current scroll is already at or past the max, or next scroll overshoots significantly
        // and it's not already at 0 (to prevent immediate re-scroll to 0 if already there)
        if (scrollLeft >= maxScrollLeft -1 || scrollLeft === 0 && targetScrollLeft > maxScrollLeft) {
          targetScrollLeft = 0; // Loop to beginning
        } else {
          targetScrollLeft = maxScrollLeft; // Go to the very end
        }
      }
      
      container.scrollTo({
        left: targetScrollLeft,
        behavior: 'smooth',
      });
    }
  }, []);

  const startAutoScroll = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      if (!isHovering) {
        advanceSlide();
      }
    }, 5000); // Change slide every 5 seconds
  }, [isHovering, advanceSlide]);

  useEffect(() => {
    if (canScroll) {
      startAutoScroll();
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
  }, [canScroll, startAutoScroll]);

  const manualScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.offsetWidth * 0.75;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      // Reset interval on manual scroll to avoid immediate auto-scroll
      if (canScroll) {
        startAutoScroll();
      }
    }
  };
  
  const showButtons = canScroll;

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
        {deals.map((deal) => (
          <div key={deal.id} className="snap-center shrink-0 w-64 sm:w-72 md:w-80">
            <ProductCard
              id={deal.id}
              name={deal.name}
              description={deal.description}
              image={deal.image}
              dataAiHint={deal.dataAiHint}
              fixedOfferPrice={deal.fixedOfferPrice}
              fixedOriginalPrice={deal.fixedOriginalPrice}
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

export default WeeklyDealsSlider;
