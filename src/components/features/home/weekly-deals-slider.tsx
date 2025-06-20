
"use client";

import { useRef, useState, useEffect, useCallback } from 'react';
import ProductCard, { type ProductCardProps } from './product-card'; // ProductCardProps ID is now string
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface DealProduct extends ProductCardProps { // id will be string from ProductCardProps
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
    const container = scrollContainerRef.current;
    if (container) {
      const checkScrollability = () => {
         setCanScroll(container.scrollWidth > container.clientWidth);
      };
      checkScrollability(); // Initial check
      window.addEventListener('resize', checkScrollability); // Recheck on resize

      // Observe changes to children in case deals are loaded dynamically
      const observer = new MutationObserver(checkScrollability);
      observer.observe(container, { childList: true, subtree: true });

      return () => {
        window.removeEventListener('resize', checkScrollability);
        observer.disconnect();
      };
    }
  }, [deals]); // Re-run if deals array itself changes

  const advanceSlide = useCallback(() => {
    const container = scrollContainerRef.current;
    if (container) {
        const firstCardWrapper = container.querySelector('div.snap-center'); // Target the card wrapper
        if (!firstCardWrapper) return;

        const cardStyle = window.getComputedStyle(firstCardWrapper);
        const cardWidth = firstCardWrapper.clientWidth; 
        
        // The slider uses `space-x-4`, which is 1rem (16px) for the gap.
        // This could be made more dynamic if Tailwind config was accessible here.
        const gap = 16; 
        const scrollStep = cardWidth + gap; 

        const { scrollLeft, scrollWidth, clientWidth } = container;
        const maxScrollLeft = scrollWidth - clientWidth;

        if (maxScrollLeft <= 1) return; 

        let nextScrollPosition = scrollLeft + scrollStep;

        // If current scroll is at or very near the end, loop to beginning
        if (scrollLeft >= maxScrollLeft - gap/2 ) { 
            nextScrollPosition = 0; 
        } else if (nextScrollPosition > maxScrollLeft) {
            // If overshooting, scroll to the very end to make last items visible before looping next time
            nextScrollPosition = maxScrollLeft; 
        }
        
        container.scrollTo({ left: nextScrollPosition, behavior: 'smooth' });
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
    }, 5000); 
  }, [isHovering, advanceSlide]);

  useEffect(() => {
    if (canScroll && deals.length > 1) { // Only scroll if scrollable and more than one deal
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
  }, [canScroll, startAutoScroll, deals.length]);

  const manualScroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (container) {
      const firstCardWrapper = container.querySelector('div.snap-center');
      if (!firstCardWrapper) return;
      const cardWidth = firstCardWrapper.clientWidth;
      const gap = 16;
      const scrollAmount = (cardWidth + gap) * 1; // Scroll by one item slot

      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      // Reset auto-scroll timer on manual interaction
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (canScroll && !isHovering && deals.length > 1) {
         intervalRef.current = setInterval(advanceSlide, 7000); // Slightly longer delay after manual
      }
    }
  };
  
  const showButtons = canScroll && deals.length > 1;

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
              rating={deal.rating}
              reviewsCount={deal.reviewsCount}
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
