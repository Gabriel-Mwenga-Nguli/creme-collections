
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
  backgroundImage?: string; // For types like firstOrder, tieredDiscount
  backgroundColor?: string; // For types like revealCode
  productImage?: string; // For revealCode
  logoImage?: string; // For freshSavers
  items?: FreshSaverItem[]; // For freshSavers
  tiers?: TieredDiscount[]; // For tieredDiscount
  actionText?: string; // e.g., "TAP TO REVEAL"
  codePlaceholder?: string; // e.g., "CODE"
  dataAiHint: string;
  foregroundColor?: string;
  accentColor?: string; // For button/code backgrounds
  topColor?: string; // For FreshSavers top part
  bottomColor?: string; // For FreshSavers bottom part
  priceColor?: string; // For FreshSavers prices
  href: string;
}

interface PromotionalOfferSliderProps {
  promos: PromoSlideProps[];
}

const PromotionalOfferSlider: React.FC<PromotionalOfferSliderProps> = ({ promos }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = useCallback((direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.offsetWidth * 0.8; // Scroll by 80% of visible width
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
    const baseCardClasses = "h-[280px] w-60 sm:w-64 md:w-72 flex flex-col justify-between p-4 rounded-lg shadow-md text-sm relative overflow-hidden";
    const defaultFgColor = promo.foregroundColor || 'text-white';

    switch (promo.type) {
      case 'firstOrder':
        return (
          <div className={`${baseCardClasses} ${promo.backgroundImage ? '' : 'bg-indigo-700'} ${defaultFgColor}`} style={promo.backgroundImage ? { backgroundImage: `url(${promo.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
            {promo.backgroundImage && <div className="absolute inset-0 bg-black/30 z-0"></div>}
            <div className="relative z-10">
              <h3 className="font-bold text-lg leading-tight">{promo.title}</h3>
              <p className="text-xs opacity-90 mb-2">{promo.subtitle}</p>
            </div>
            <div className="relative z-10 mt-auto">
              <div className="bg-white text-indigo-700 p-2 rounded-md text-center shadow">
                <span className="text-xs block">Use Code:</span>
                <span className={`font-bold text-xl block ${promo.accentColor ? promo.accentColor.replace('bg-','text-') : 'text-red-500'}`}>{promo.code}</span>
              </div>
              {promo.terms && <p className="text-xs opacity-70 mt-2 text-center">{promo.terms}</p>}
            </div>
             {/* Placeholder for shopping cart image if design needs it at bottom */}
             {/* <Image src="/images/promos/shopping-cart-promo.png" alt="Shopping Cart" width={100} height={80} className="absolute bottom-0 right-0 opacity-50" data-ai-hint="shopping cart illustration" /> */}
          </div>
        );
      case 'tieredDiscount':
        return (
          <div className={`${baseCardClasses} ${promo.backgroundImage ? '' : 'bg-blue-600'} ${defaultFgColor}`} style={promo.backgroundImage ? { backgroundImage: `url(${promo.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
            {promo.backgroundImage && <div className="absolute inset-0 bg-black/40 z-0"></div>}
            <div className="relative z-10">
              <h3 className="font-bold text-lg mb-2">{promo.title}</h3>
              <div className="space-y-1.5 mb-2">
                {promo.tiers?.map((tier, i) => (
                  <div key={i} className="bg-white/20 backdrop-blur-sm p-1.5 rounded text-center">
                    <p className="font-semibold text-base">
                      <span className="text-xl">{tier.amount}</span> Ksh Off
                    </p>
                    <p className="text-[10px] opacity-80">
                      Min Spend {tier.spend}{tier.maxSpend && tier.maxSpend !== -1 ? ` - Max ${tier.maxSpend}` : ''}
                    </p>
                  </div>
                ))}
              </div>
              <div className="bg-white text-blue-700 p-2 rounded-md text-center shadow mt-1">
                <span className="text-xs block">Use Code:</span>
                <span className="font-bold text-xl block">{promo.code}</span>
              </div>
              {promo.terms && <p className="text-[10px] opacity-70 mt-1.5 text-center">{promo.terms}</p>}
            </div>
          </div>
        );
      case 'revealCode':
        return (
          <div className={`${baseCardClasses} ${promo.backgroundColor || 'bg-amber-50'} ${promo.foregroundColor || 'text-slate-700'}`}>
            <div className="text-center">
              <h3 className="font-semibold text-base leading-tight">{promo.title}</h3>
              {promo.subtitle && <p className="text-xs opacity-80">{promo.subtitle}</p>}
            </div>
            <div className="my-2 flex-grow flex items-center justify-center">
              {promo.productImage && <Image src={promo.productImage} alt={promo.title || "Product"} width={100} height={100} className="object-contain max-h-[100px]" data-ai-hint={promo.dataAiHint} />}
            </div>
            <div className={`p-2 rounded-md text-center border-2 border-dashed ${promo.accentColor ? promo.accentColor.replace('bg-','border-') : 'border-red-500'} ${promo.accentColor ? promo.accentColor.replace('bg-','text-') : 'text-red-600'}`}>
              <p className="text-[10px] font-medium">{promo.actionText}</p>
              <p className="font-bold text-lg">{promo.codePlaceholder}</p>
            </div>
          </div>
        );
      case 'freshSavers':
        return (
          <div className={`${baseCardClasses} p-0 ${defaultFgColor}`}>
            <div className={`h-1/3 ${promo.topColor || 'bg-red-600'} rounded-t-lg flex flex-col items-center justify-center p-2 relative`}>
              {/* Placeholder for Fresh Savers logo - simple text for now */}
              {promo.logoImage ? 
                <Image src={promo.logoImage} alt="Fresh Savers" width={80} height={30} data-ai-hint="grocery logo" />
                : <h4 className="font-bold text-lg italic">fresh <span className="text-green-300">SAVERS</span></h4>
              }
              <p className="text-[10px] opacity-90 text-center leading-tight mt-0.5">{promo.subtitle}</p>
            </div>
            <div className={`h-2/3 ${promo.bottomColor || 'bg-sky-200'} rounded-b-lg flex items-end justify-center p-2 space-x-1.5 relative`}>
              {/* Wavy divider (conceptual) - for simplicity, a straight line or just color change is fine */}
               <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-b from-transparent via-black/5 to-transparent z-10"></div>
               {/* Products */}
              {promo.items?.slice(0,2).map((item, i) => (
                <div key={i} className="relative w-1/2 text-center">
                  {item.image && <Image src={item.image} alt={item.name} width={60} height={60} className="object-contain mx-auto mb-0.5 h-14" data-ai-hint={item.dataAiHint} />}
                  <div className={`absolute -top-6 ${i === 0 ? 'left-1' : 'right-1'}`}>
                    <div className={`${promo.priceColor ? promo.priceColor.replace('text-','bg-') : 'bg-red-600'} text-white text-[10px] leading-none font-semibold p-1 rounded-full shadow-md min-w-[36px]`}>
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
        return <div>Unsupported promo type</div>;
    }
  };

  return (
    <div className="relative group">
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto space-x-3 sm:space-x-4 py-4 scrollbar-hide scroll-smooth -mx-2 px-2"
      >
        {promos.map((promo, index) => (
          <Link href={promo.href} key={index} className="block snap-center shrink-0 group/promo-card hover:scale-[1.02] transition-transform duration-200">
            {renderCardContent(promo)}
          </Link>
        ))}
      </div>
      
      {promos.length > 1 && ( // Show buttons only if there's something to scroll
        <>
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll('left')}
            aria-label="Scroll left"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-background/70 hover:bg-background/90 rounded-full shadow-md h-9 w-9 sm:h-10 sm:w-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 focus:opacity-100 disabled:opacity-30"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll('right')}
            aria-label="Scroll right"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-background/70 hover:bg-background/90 rounded-full shadow-md h-9 w-9 sm:h-10 sm:w-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 focus:opacity-100 disabled:opacity-30"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </Button>
        </>
      )}
    </div>
  );
};

export default PromotionalOfferSlider;
