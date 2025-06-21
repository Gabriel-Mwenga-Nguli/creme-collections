
"use client";

import React, { useRef, useCallback, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Ticket, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TieredDiscount {
  amount: number;
  spend: number;
  maxSpend?: number;
}

interface FreshSaverItem {
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  dataAiHint: string;
}

export interface PromoSlideProps {
  type: 'firstOrder' | 'tieredDiscount' | 'revealCode';
  title: string;
  subtitle?: string;
  code?: string;
  terms?: string;
  backgroundImage?: string;
  backgroundColor?: string;
  productImage?: string;
  logoImage?: string;
  items?: FreshSaverItem[];
  tiers?: TieredDiscount[];
  actionText?: string;
  codePlaceholder?: string;
  dataAiHint: string;
  foregroundColor?: string;
  accentColor?: string;
  topColor?: string;
  bottomColor?: string;
  priceColor?: string;
  href: string;
  buttonText?: string;
}

interface PromotionalOfferSliderProps {
  promos: PromoSlideProps[];
}

const PromotionalOfferSlider: React.FC<PromotionalOfferSliderProps> = ({ promos }) => {
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
  }, [promos, updateScrollability]);

  const advanceSlide = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container || !canScroll) return;
    
    const firstCardWrapper = container.querySelector('div > a') as HTMLElement; // Get the Link wrapper
    if (!firstCardWrapper) return;
    
    const cardWidth = firstCardWrapper.offsetWidth;
    const gap = window.innerWidth < 640 ? 12 : 16; 
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
    if (canScroll && !isHovering && promos.length > 1) {
      intervalRef.current = setInterval(advanceSlide, 5000);
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
  }, [canScroll, isHovering, advanceSlide, promos.length]);

  const manualScroll = useCallback((direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container || !canScroll) return;

    const firstCardWrapper = container.querySelector('div > a') as HTMLElement;
    if (!firstCardWrapper) return;
    const cardWidth = firstCardWrapper.offsetWidth;
    const gap = window.innerWidth < 640 ? 12 : 16;
    const scrollAmount = cardWidth + gap;

    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (canScroll && !isHovering && promos.length > 1) {
      intervalRef.current = setInterval(advanceSlide, 7000); 
    }
  }, [canScroll, isHovering, advanceSlide, promos.length]);

  if (!promos || promos.length === 0) {
    return null;
  }

  const renderCardContent = (promo: PromoSlideProps) => {
    const baseCardClasses = "h-[280px] w-[210px] sm:h-[300px] sm:w-[230px] md:h-[320px] md:w-[250px] flex flex-col justify-between p-3.5 rounded-xl shadow-lg relative overflow-hidden group/promocard transition-all duration-300 ease-out hover:shadow-2xl";
    const defaultFgColor = promo.foregroundColor || 'text-white';
    const defaultAccentColor = promo.accentColor || 'text-primary';

    switch (promo.type) {
      case 'firstOrder':
        return (
          <div className={cn(baseCardClasses, defaultFgColor, promo.backgroundImage ? '' : 'bg-gradient-to-br from-primary to-accent')} style={promo.backgroundImage ? { backgroundImage: `url(${promo.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
            {promo.backgroundImage && <div className="absolute inset-0 bg-black/40 z-0 group-hover/promocard:bg-black/50 transition-colors duration-300"></div>}
            <div className="relative z-10 flex flex-col h-full">
              <h3 className="font-bold text-xl leading-tight tracking-tight">{promo.title}</h3>
              {promo.subtitle && <p className="text-xs opacity-90 mb-1.5 flex-grow">{promo.subtitle}</p>}
              <div className={cn("bg-white p-2.5 rounded-md text-center shadow-md mt-auto transition-transform duration-300 group-hover/promocard:scale-105", defaultAccentColor)}>
                <span className="text-xs block font-medium opacity-80">Use Code:</span>
                <span className="font-bold text-2xl block tracking-tight">{promo.code}</span>
              </div>
              {promo.terms && <p className="text-[9px] opacity-70 mt-1.5 text-center leading-tight">{promo.terms}</p>}
            </div>
          </div>
        );
      case 'tieredDiscount':
        return (
            <div className={cn(baseCardClasses, defaultFgColor, 'bg-gradient-to-tr from-slate-900 to-slate-700')}>
            <div className="relative z-10 flex flex-col h-full">
              <h3 className="font-bold text-lg mb-1.5 leading-tight tracking-tight">{promo.title}</h3>
              <div className="space-y-1 mb-1.5 flex-grow">
                {promo.tiers?.map((tier, i) => (
                  <div key={i} className="bg-white/20 backdrop-blur-sm p-1.5 rounded-md text-center transition-all duration-300 group-hover/promocard:bg-white/30">
                    <p className="font-semibold text-sm leading-none">
                      <span className="text-lg">{tier.amount}</span> Ksh Off
                    </p>
                    <p className="text-[9px] opacity-80 leading-tight">
                      Min Spend {tier.spend.toLocaleString()}{tier.maxSpend && tier.maxSpend !== -1 ? ` - ${tier.maxSpend.toLocaleString()}` : ''}
                    </p>
                  </div>
                ))}
              </div>
              <div className={cn("bg-white p-2 rounded-md text-center shadow-md mt-auto transition-transform duration-300 group-hover/promocard:scale-105", defaultAccentColor)}>
                <span className="text-xs block font-medium opacity-80">Use Code:</span>
                <span className="font-bold text-xl block tracking-tight">{promo.code}</span>
              </div>
              {promo.terms && <p className="text-[9px] opacity-70 mt-1 text-center leading-tight">{promo.terms}</p>}
            </div>
          </div>
        );
      case 'revealCode':
        return (
          <div className={cn(baseCardClasses, promo.backgroundColor || 'bg-secondary', promo.foregroundColor || 'text-secondary-foreground')}>
            <div className="text-center">
              <h3 className="font-semibold text-md leading-tight tracking-tight">{promo.title}</h3>
              {promo.subtitle && <p className="text-xs opacity-80">{promo.subtitle}</p>}
            </div>
            <div className="my-2 flex-grow flex items-center justify-center transition-transform duration-300 group-hover/promocard:scale-105">
              {promo.productImage && <Image src={promo.productImage} alt={promo.title || "Product"} width={90} height={90} className="object-contain max-h-[90px] rounded-md" data-ai-hint={promo.dataAiHint} />}
            </div>
            <div className={cn("p-2 rounded-md text-center border-2 border-dashed transition-all duration-300 group-hover/promocard:bg-opacity-10", promo.accentColor || 'border-primary text-primary bg-primary/10')}>
              <p className="text-xs font-medium">{promo.actionText}</p>
              <p className="font-bold text-lg tracking-tight">{promo.codePlaceholder}</p>
            </div>
          </div>
        );
      default:
        return <div className="text-destructive">Unsupported promo type</div>;
    }
  };
  
  const showButtons = canScroll && promos.length > 1;

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto space-x-3 sm:space-x-4 py-4 scrollbar-hide scroll-smooth -mx-2 px-2"
      >
        {promos.map((promo, index) => (
          <div key={index} className="snap-center shrink-0"> 
            <Link href={promo.href} className="block transform transition-transform duration-300 ease-out hover:-translate-y-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-xl">
              {renderCardContent(promo)}
            </Link>
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
            className="absolute left-0 sm:-left-1 top-1/2 -translate-y-1/2 z-20 bg-background/70 hover:bg-background/90 backdrop-blur-sm rounded-full shadow-lg h-9 w-9 sm:h-10 sm:w-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 focus:opacity-100 disabled:opacity-30 border-border hover:border-primary"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => manualScroll('right')}
            aria-label="Scroll right"
            className="absolute right-0 sm:-right-1 top-1/2 -translate-y-1/2 z-20 bg-background/70 hover:bg-background/90 backdrop-blur-sm rounded-full shadow-lg h-9 w-9 sm:h-10 sm:w-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 focus:opacity-100 disabled:opacity-30 border-border hover:border-primary"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
          </Button>
        </>
      )}
    </div>
  );
};

export default PromotionalOfferSlider;
