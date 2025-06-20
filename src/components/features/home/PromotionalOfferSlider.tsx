
"use client";

import React, { useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Ticket, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils'; // Added this import

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
  type: 'firstOrder' | 'tieredDiscount' | 'revealCode' | 'freshSavers';
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

  const scroll = useCallback((direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.querySelector('div > a > div')?.clientWidth || 250; 
      const scrollAmount = cardWidth * 1; 
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  }, []);

  if (!promos || promos.length === 0) {
    return null;
  }

  const renderCardContent = (promo: PromoSlideProps) => {
    const baseCardClasses = "h-[280px] w-[210px] sm:h-[300px] sm:w-[230px] md:h-[320px] md:w-[250px] flex flex-col justify-between p-3.5 rounded-xl shadow-lg relative overflow-hidden group/promocard transition-all duration-300 ease-out hover:shadow-2xl";
    const defaultFgColor = promo.foregroundColor || 'text-white';
    const defaultAccentColor = promo.accentColor || 'bg-red-500';

    switch (promo.type) {
      case 'firstOrder':
        return (
          <div className={cn(baseCardClasses, defaultFgColor, promo.backgroundImage ? '' : 'bg-gradient-to-br from-indigo-600 to-purple-700')} style={promo.backgroundImage ? { backgroundImage: `url(${promo.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
            {promo.backgroundImage && <div className="absolute inset-0 bg-black/40 z-0 group-hover/promocard:bg-black/50 transition-colors duration-300"></div>}
            <div className="relative z-10 flex flex-col h-full">
              <h3 className="font-bold text-xl leading-tight tracking-tight">{promo.title}</h3>
              {promo.subtitle && <p className="text-xs opacity-90 mb-1.5 flex-grow">{promo.subtitle}</p>}
              <div className={cn("bg-white p-2.5 rounded-md text-center shadow-md mt-auto transition-transform duration-300 group-hover/promocard:scale-105", defaultAccentColor.replace('bg-','text-'))}>
                <span className="text-xs block font-medium opacity-80">Use Code:</span>
                <span className="font-bold text-2xl block tracking-tight">{promo.code}</span>
              </div>
              {promo.terms && <p className="text-[9px] opacity-70 mt-1.5 text-center leading-tight">{promo.terms}</p>}
            </div>
          </div>
        );
      case 'tieredDiscount':
        return (
          <div className={cn(baseCardClasses, defaultFgColor, promo.backgroundImage ? '' : 'bg-gradient-to-br from-blue-600 to-sky-700')} style={promo.backgroundImage ? { backgroundImage: `url(${promo.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
            {promo.backgroundImage && <div className="absolute inset-0 bg-black/50 z-0 group-hover/promocard:bg-black/60 transition-colors duration-300"></div>}
            <div className="relative z-10 flex flex-col h-full">
              <h3 className="font-bold text-lg mb-1.5 leading-tight tracking-tight">{promo.title}</h3>
              <div className="space-y-1 mb-1.5 flex-grow">
                {promo.tiers?.map((tier, i) => (
                  <div key={i} className="bg-white/20 backdrop-blur-sm p-1.5 rounded-md text-center transition-all duration-300 group-hover/promocard:bg-white/30">
                    <p className="font-semibold text-sm leading-none">
                      <span className="text-lg">{tier.amount}</span> Ksh Off
                    </p>
                    <p className="text-[9px] opacity-80 leading-tight">
                      Min Spend {tier.spend}{tier.maxSpend && tier.maxSpend !== -1 ? ` - ${tier.maxSpend}` : ''}
                    </p>
                  </div>
                ))}
              </div>
              <div className={cn("bg-white p-2 rounded-md text-center shadow-md mt-auto transition-transform duration-300 group-hover/promocard:scale-105", defaultAccentColor.replace('bg-','text-'))}>
                <span className="text-xs block font-medium opacity-80">Use Code:</span>
                <span className="font-bold text-xl block tracking-tight">{promo.code}</span>
              </div>
              {promo.terms && <p className="text-[9px] opacity-70 mt-1 text-center leading-tight">{promo.terms}</p>}
            </div>
          </div>
        );
      case 'revealCode':
        return (
          <div className={cn(baseCardClasses, promo.backgroundColor || 'bg-amber-50', promo.foregroundColor || 'text-slate-700')}>
            <div className="text-center">
              <h3 className="font-semibold text-md leading-tight tracking-tight">{promo.title}</h3>
              {promo.subtitle && <p className="text-xs opacity-80">{promo.subtitle}</p>}
            </div>
            <div className="my-2 flex-grow flex items-center justify-center transition-transform duration-300 group-hover/promocard:scale-105">
              {promo.productImage && <Image src={promo.productImage} alt={promo.title || "Product"} width={90} height={90} className="object-contain max-h-[90px] rounded-md" data-ai-hint={promo.dataAiHint} />}
            </div>
            <div className={cn("p-2 rounded-md text-center border-2 border-dashed transition-all duration-300 group-hover/promocard:bg-opacity-10", promo.accentColor ? promo.accentColor.replace('bg-','border-').replace('text-','border-') : 'border-red-500', promo.accentColor ? promo.accentColor.replace('bg-','text-') : 'text-red-600', promo.accentColor ? promo.accentColor.replace('text-','bg-')+' bg-opacity-10' : 'bg-red-500/10')}>
              <p className="text-xs font-medium">{promo.actionText}</p>
              <p className="font-bold text-lg tracking-tight">{promo.codePlaceholder}</p>
            </div>
          </div>
        );
      case 'freshSavers':
        return (
          <div className={cn(baseCardClasses, "p-0", defaultFgColor, "flex flex-col")}>
            <div className={cn("flex-none h-1/3 rounded-t-xl flex flex-col items-center justify-center p-2 relative text-center", promo.topColor || 'bg-red-600')}>
              {promo.logoImage ?
                <Image src={promo.logoImage} alt="Fresh Savers Logo" width={70} height={25} className="object-contain transition-transform duration-300 group-hover/promocard:scale-105" data-ai-hint="grocery logo" />
                : <h4 className="font-bold text-lg italic">fresh <span className="text-green-300">SAVERS</span></h4>
              }
              {promo.subtitle && <p className="text-[10px] opacity-90 leading-tight mt-0.5">{promo.subtitle}</p>}
            </div>
            <div className={cn("flex-grow rounded-b-xl flex items-end justify-around p-2.5 pt-5 space-x-1 relative", promo.bottomColor || 'bg-sky-200')}>
               <div className="absolute -top-px left-0 right-0 h-3 bg-gradient-to-b from-transparent via-black/5 to-transparent z-10 opacity-30 group-hover/promocard:opacity-10"></div>
              {promo.items?.slice(0,2).map((item, i) => (
                <div key={i} className="relative w-1/2 text-center flex flex-col items-center justify-end h-full">
                  {item.image && <Image src={item.image} alt={item.name} width={50} height={50} className="object-contain mx-auto mb-0.5 h-12 transition-transform duration-300 group-hover/promocard:scale-110" data-ai-hint={item.dataAiHint} />}
                   <p className={cn("text-[10px] leading-tight font-medium mt-0.5", promo.foregroundColor ? promo.foregroundColor.replace('text-white','text-slate-700') : 'text-slate-700')}>{item.name}</p>
                  <div className={cn("absolute -top-3 left-1/2 -translate-x-1/2")}>
                    <div className={cn("text-white text-[10px] leading-none font-semibold p-1.5 rounded-full shadow-md min-w-[36px] transition-transform duration-300 group-hover/promocard:scale-105", promo.priceColor ? promo.priceColor.replace('text-','bg-') : 'bg-red-600')}>
                      {item.oldPrice && <span className="block line-through opacity-70 text-[8px]">{item.oldPrice}</span>}
                      {item.price} <span className="text-[8px]">KES</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return <div className="text-destructive">Unsupported promo type</div>;
    }
  };

  return (
    <div className="relative group">
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto space-x-3 sm:space-x-4 py-4 scrollbar-hide scroll-smooth -mx-2 px-2"
      >
        {promos.map((promo, index) => (
          <Link href={promo.href} key={index} className="block snap-center shrink-0 group/promo-card-link transform transition-transform duration-300 ease-out hover:-translate-y-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-xl">
            {renderCardContent(promo)}
          </Link>
        ))}
      </div>

      {promos.length > 2 && (
        <>
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll('left')}
            aria-label="Scroll left"
            className="absolute left-0 sm:-left-1 top-1/2 -translate-y-1/2 z-20 bg-background/70 hover:bg-background/90 backdrop-blur-sm rounded-full shadow-lg h-9 w-9 sm:h-10 sm:w-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 focus:opacity-100 disabled:opacity-30 border-border hover:border-primary"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll('right')}
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
