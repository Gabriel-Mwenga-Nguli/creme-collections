
"use client";

import React, { useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TieredDiscount {
  amount: number;
  spend: number;
  maxSpend?: number; // -1 for no max, or a specific value
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
}

interface PromotionalOfferSliderProps {
  promos: PromoSlideProps[];
}

const PromotionalOfferSlider: React.FC<PromotionalOfferSliderProps> = ({ promos }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = useCallback((direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.offsetWidth * 0.8;
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
    const baseCardClasses = "h-[280px] w-60 sm:w-64 md:w-72 flex flex-col justify-between p-4 rounded-xl shadow-lg text-sm relative overflow-hidden group/promocard transition-all duration-300 ease-out hover:shadow-2xl";
    const defaultFgColor = promo.foregroundColor || 'text-white';

    switch (promo.type) {
      case 'firstOrder':
        return (
          <div className={`${baseCardClasses} ${defaultFgColor} ${promo.backgroundImage ? '' : 'bg-gradient-to-br from-indigo-600 to-purple-700'}`} style={promo.backgroundImage ? { backgroundImage: `url(${promo.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
            {promo.backgroundImage && <div className="absolute inset-0 bg-black/40 z-0 group-hover/promocard:bg-black/50 transition-colors duration-300"></div>}
            <div className="relative z-10 flex flex-col h-full">
              <h3 className="font-bold text-xl leading-tight">{promo.title}</h3>
              <p className="text-xs opacity-90 mb-2 flex-grow">{promo.subtitle}</p>
              <div className="bg-white text-indigo-700 p-2.5 rounded-md text-center shadow-md mt-auto transition-transform duration-300 group-hover/promocard:scale-105">
                <span className="text-xs block font-medium">Use Code:</span>
                <span className={`font-bold text-2xl block ${promo.accentColor ? promo.accentColor.replace('bg-','text-') : 'text-red-500'}`}>{promo.code}</span>
              </div>
              {promo.terms && <p className="text-[10px] opacity-70 mt-2 text-center leading-tight">{promo.terms}</p>}
            </div>
          </div>
        );
      case 'tieredDiscount':
        return (
          <div className={`${baseCardClasses} ${defaultFgColor} ${promo.backgroundImage ? '' : 'bg-gradient-to-br from-blue-600 to-sky-700'}`} style={promo.backgroundImage ? { backgroundImage: `url(${promo.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
            {promo.backgroundImage && <div className="absolute inset-0 bg-black/50 z-0 group-hover/promocard:bg-black/60 transition-colors duration-300"></div>}
            <div className="relative z-10 flex flex-col h-full">
              <h3 className="font-bold text-xl mb-2 leading-tight">{promo.title}</h3>
              <div className="space-y-1.5 mb-2 flex-grow">
                {promo.tiers?.map((tier, i) => (
                  <div key={i} className="bg-white/20 backdrop-blur-sm p-1.5 rounded-md text-center transition-all duration-300 group-hover/promocard:bg-white/30">
                    <p className="font-semibold text-base">
                      <span className="text-xl">{tier.amount}</span> Ksh Off
                    </p>
                    <p className="text-[10px] opacity-80">
                      Min Spend {tier.spend}{tier.maxSpend && tier.maxSpend !== -1 ? ` - Max ${tier.maxSpend}` : ''}
                    </p>
                  </div>
                ))}
              </div>
              <div className="bg-white text-blue-700 p-2.5 rounded-md text-center shadow-md mt-auto transition-transform duration-300 group-hover/promocard:scale-105">
                <span className="text-xs block font-medium">Use Code:</span>
                <span className="font-bold text-2xl block">{promo.code}</span>
              </div>
              {promo.terms && <p className="text-[10px] opacity-70 mt-1.5 text-center leading-tight">{promo.terms}</p>}
            </div>
          </div>
        );
      case 'revealCode':
        return (
          <div className={`${baseCardClasses} ${promo.backgroundColor || 'bg-amber-50'} ${promo.foregroundColor || 'text-slate-700'}`}>
            <div className="text-center">
              <h3 className="font-semibold text-lg leading-tight">{promo.title}</h3>
              {promo.subtitle && <p className="text-xs opacity-80">{promo.subtitle}</p>}
            </div>
            <div className="my-3 flex-grow flex items-center justify-center transition-transform duration-300 group-hover/promocard:scale-105">
              {promo.productImage && <Image src={promo.productImage} alt={promo.title || "Product"} width={100} height={100} className="object-contain max-h-[100px] rounded-md" data-ai-hint={promo.dataAiHint} />}
            </div>
            <div className={`p-2.5 rounded-md text-center border-2 border-dashed ${promo.accentColor ? promo.accentColor.replace('bg-','border-') : 'border-red-500'} ${promo.accentColor ? promo.accentColor.replace('bg-','text-') : 'text-red-600'} transition-all duration-300 group-hover/promocard:bg-red-500/10`}>
              <p className="text-xs font-medium">{promo.actionText}</p>
              <p className="font-bold text-xl">{promo.codePlaceholder}</p>
            </div>
          </div>
        );
      case 'freshSavers':
        return (
          <div className={`${baseCardClasses} p-0 ${defaultFgColor} flex flex-col`}>
            <div className={`flex-none h-1/3 ${promo.topColor || 'bg-red-600'} rounded-t-xl flex flex-col items-center justify-center p-2 relative text-center`}>
              {promo.logoImage ?
                <Image src={promo.logoImage} alt="Fresh Savers" width={80} height={30} className="object-contain transition-transform duration-300 group-hover/promocard:scale-105" data-ai-hint="grocery logo" />
                : <h4 className="font-bold text-lg italic">fresh <span className="text-green-300">SAVERS</span></h4>
              }
              <p className="text-[10px] opacity-90 leading-tight mt-0.5">{promo.subtitle}</p>
            </div>
            <div className={`flex-grow ${promo.bottomColor || 'bg-sky-200'} rounded-b-xl flex items-end justify-around p-2 space-x-1.5 relative`}>
               <div className="absolute -top-0.5 left-0 right-0 h-4 bg-gradient-to-b from-transparent via-black/5 to-transparent z-10 opacity-50 group-hover/promocard:opacity-20"></div>
              {promo.items?.slice(0,2).map((item, i) => (
                <div key={i} className="relative w-1/2 text-center flex flex-col items-center justify-end h-full">
                  {item.image && <Image src={item.image} alt={item.name} width={60} height={60} className="object-contain mx-auto mb-1 h-16 transition-transform duration-300 group-hover/promocard:scale-110" data-ai-hint={item.dataAiHint} />}
                  <div className={`absolute -top-5 ${i === 0 ? 'left-1' : 'right-1'}`}>
                    <div className={`${promo.priceColor ? promo.priceColor.replace('text-','bg-') : 'bg-red-600'} text-white text-[10px] leading-none font-semibold p-1.5 rounded-full shadow-md min-w-[40px] transition-transform duration-300 group-hover/promocard:scale-105`}>
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
        className="flex overflow-x-auto space-x-4 sm:space-x-5 py-4 scrollbar-hide scroll-smooth -mx-2 px-2"
      >
        {promos.map((promo, index) => (
          <Link href={promo.href} key={index} className="block snap-center shrink-0 group/promo-card-link transform transition-transform duration-300 ease-out hover:-translate-y-1">
            {renderCardContent(promo)}
          </Link>
        ))}
      </div>

      {promos.length > 2 && ( // Show buttons if there are enough items to scroll
        <>
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll('left')}
            aria-label="Scroll left"
            className="absolute left-0 sm:-left-2 top-1/2 -translate-y-1/2 z-20 bg-background/80 hover:bg-background/95 backdrop-blur-sm rounded-full shadow-lg h-10 w-10 sm:h-12 sm:w-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300 focus:opacity-100 disabled:opacity-30 border-border hover:border-primary"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll('right')}
            aria-label="Scroll right"
            className="absolute right-0 sm:-right-2 top-1/2 -translate-y-1/2 z-20 bg-background/80 hover:bg-background/95 backdrop-blur-sm rounded-full shadow-lg h-10 w-10 sm:h-12 sm:w-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300 focus:opacity-100 disabled:opacity-30 border-border hover:border-primary"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
          </Button>
        </>
      )}
    </div>
  );
};

export default PromotionalOfferSlider;
