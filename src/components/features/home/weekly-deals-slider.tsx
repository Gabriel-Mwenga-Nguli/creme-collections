
"use client";

import { useRef } from 'react';
import ProductCard, { type ProductCardProps } from './product-card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface DealProduct extends ProductCardProps {
  // Ensures fixed prices are part of the deal product structure,
  // even though ProductCardProps makes them optional.
  // For deals, these should always be provided.
  fixedOfferPrice: number;
  fixedOriginalPrice: number;
}

interface WeeklyDealsSliderProps {
  deals: DealProduct[];
}

const WeeklyDealsSlider: React.FC<WeeklyDealsSliderProps> = ({ deals }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.offsetWidth * 0.75; // Scroll by 75% of visible width
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // Determine if buttons should be shown based on typical item width vs container width
  // This is a heuristic. A more robust solution would measure actual widths.
  const itemsPotentiallyVisible = typeof window !== 'undefined' ? Math.floor(window.innerWidth / 300) : 3; // Approx 300px per card
  const showButtons = deals.length > itemsPotentiallyVisible;


  return (
    <div className="relative group">
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto space-x-4 py-4 scrollbar-hide snap-x snap-mandatory scroll-smooth -mx-2 px-2" // Negative margin to allow cards to reach edges before buttons
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
            onClick={() => scroll('left')}
            aria-label="Scroll left"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/50 hover:bg-background/90 rounded-full shadow-md h-10 w-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 focus:opacity-100"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll('right')}
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
