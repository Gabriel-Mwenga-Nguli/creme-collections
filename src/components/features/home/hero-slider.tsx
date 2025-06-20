
"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Slide {
  id: number;
  image: string;
  dataAiHint: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  textAlign?: 'left' | 'center' | 'right';
  textColor?: string;
  overlayColor?: string;
  titleSize?: string;
  subtitleSize?: string;
  contentAnimation?: string; // e.g., 'animate-fade-in-left'
}

const slidesData: Slide[] = [
  {
    id: 1,
    image: '/images/banners/slide1.png',
    dataAiHint: 'fashion model runway',
    title: 'Step Into Style',
    subtitle: 'Explore the latest trends in fashion. New arrivals weekly!',
    buttonText: 'Shop Fashion',
    buttonLink: '/products/category/fashion',
    textAlign: 'left',
    textColor: 'text-white',
    overlayColor: 'bg-black/40',
    titleSize: 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl',
    subtitleSize: 'text-lg sm:text-xl md:text-2xl',
    contentAnimation: 'animate-fade-in-right'
  },
  {
    id: 2,
    image: '/images/banners/slide2.png',
    dataAiHint: 'modern technology gadgets',
    title: 'Future is Here',
    subtitle: 'Cutting-edge electronics to elevate your lifestyle.',
    buttonText: 'Discover Tech',
    buttonLink: '/products/category/electronics',
    textAlign: 'center',
    textColor: 'text-white',
    overlayColor: 'bg-primary/40',
    titleSize: 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl',
    subtitleSize: 'text-lg sm:text-xl md:text-2xl',
    contentAnimation: 'animate-fade-in-up'
  },
  {
    id: 3,
    image: '/images/banners/slide3.png',
    dataAiHint: 'cozy home interior',
    title: 'Home Sweet Home',
    subtitle: 'Furnishings & decor that bring comfort and elegance.',
    buttonText: 'Explore Home',
    buttonLink: '/products/category/home-living',
    textAlign: 'right',
    textColor: 'text-white', 
    overlayColor: 'bg-amber-100/30',
    titleSize: 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl',
    subtitleSize: 'text-lg sm:text-xl md:text-2xl',
    contentAnimation: 'animate-fade-in-left'
  },
  {
    id: 4,
    image: '/images/banners/promo1.png',
    dataAiHint: 'shopping promotion sale',
    title: 'MEGA DEALS DAILY!',
    subtitle: 'Don\'t miss out on incredible savings. Limited stock available.',
    buttonText: 'Grab Deals',
    buttonLink: '/products?filter=sale',
    textAlign: 'left',
    textColor: 'text-white',
    overlayColor: 'bg-slate-800/50',
    titleSize: 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl',
    subtitleSize: 'text-lg sm:text-xl md:text-2xl',
    contentAnimation: 'animate-fade-in-right'
  },
  {
    id: 5,
    image: '/images/banners/electronics.png',
    dataAiHint: 'electronics devices sale',
    title: 'Electronics Hub',
    subtitle: 'Your one-stop shop for all things tech. Best prices guaranteed.',
    buttonText: 'Shop Electronics',
    buttonLink: '/products/category/electronics',
    textAlign: 'center',
    textColor: 'text-white',
    overlayColor: 'bg-blue-700/40',
    titleSize: 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl',
    subtitleSize: 'text-lg sm:text-xl md:text-2xl',
    contentAnimation: 'animate-fade-in-up'
  },
   {
    id: 6,
    image: '/images/banners/beauty.png',
    dataAiHint: 'beauty products cosmetics',
    title: 'Glow Up Season',
    subtitle: 'Discover premium beauty products for your radiant look.',
    buttonText: 'Explore Beauty',
    buttonLink: '/products/category/beauty-personal-care',
    textAlign: 'right',
    textColor: 'text-white', 
    overlayColor: 'bg-black/30', 
    titleSize: 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl',
    subtitleSize: 'text-lg sm:text-xl md:text-2xl',
    contentAnimation: 'animate-fade-in-left'
  }
];

const HeroSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false); // To prevent rapid clicks during animation
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  const nextSlide = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev === slidesData.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsAnimating(false), 1000); // Match opacity transition duration
  }, [isAnimating]);

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(nextSlide, 7000);
    return () => {
      resetTimeout();
    };
  }, [currentIndex, nextSlide, resetTimeout]);


  const prevSlide = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev === 0 ? slidesData.length - 1 : prev - 1));
    setTimeout(() => setIsAnimating(false), 1000); 
  }, [isAnimating]);
  
  const goToSlide = useCallback((index: number) => {
    if (isAnimating || index === currentIndex) return;
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 1000);
  }, [currentIndex, isAnimating]);


  const textAlignClasses = {
    left: 'items-start text-left',
    center: 'items-center text-center',
    right: 'items-end text-right',
  };

  return (
    <section className="relative w-full h-[calc(100vh-100px)] min-h-[480px] max-h-[800px] overflow-hidden group bg-slate-200 dark:bg-slate-800">
      {slidesData.map((slide, index) => (
        <div
          key={slide.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000 ease-in-out",
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
          )}
        >
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              style={{ objectFit: 'cover' }}
              priority={index === 0}
              className={cn(
                "transition-transform duration-[7s] ease-linear", // Ken burns duration
                index === currentIndex ? 'scale-110 animate-kenburns' : 'scale-100' // Apply animation only to current slide
              )}
              data-ai-hint={slide.dataAiHint}
              sizes="100vw"
            />
          </div>
          <div className={`absolute inset-0 ${slide.overlayColor || 'bg-black/30'}`} />
          <div
            className={cn(
              `absolute inset-0 container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center ${textAlignClasses[slide.textAlign || 'left']} ${slide.textColor || 'text-white'} p-6 md:p-12 lg:p-20`
            )}
          >
            <h1 className={cn(`${slide.titleSize || 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl'} font-extrabold drop-shadow-lg font-headline leading-tight max-w-2xl`, index === currentIndex ? slide.contentAnimation : 'opacity-0')}
                style={{animationDelay: index === currentIndex ? '0.3s' : '0s', animationDuration: '0.8s' }}
            >
              {slide.title}
            </h1>
            <p className={cn(`${slide.subtitleSize || 'text-lg sm:text-xl md:text-2xl'} mt-4 max-w-lg drop-shadow-lg`, index === currentIndex ? slide.contentAnimation : 'opacity-0')} 
                style={{animationDelay: index === currentIndex ? '0.5s' : '0s', animationDuration: '0.8s' }}>
              {slide.subtitle}
            </p>
            <Button
              asChild
              size="lg"
              className={cn("mt-6 md:mt-8 w-fit text-base md:text-lg px-6 md:px-8 py-3 md:py-4 font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95", index === currentIndex ? slide.contentAnimation : 'opacity-0')}
              style={{animationDelay: index === currentIndex ? '0.7s' : '0s', animationDuration: '0.8s' }}
            >
              <Link href={slide.buttonLink}>
                {slide.buttonText} <ShoppingBag className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      ))}

      <Button
        variant="outline"
        size="icon"
        onClick={prevSlide}
        disabled={isAnimating}
        aria-label="Previous slide"
        className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 text-white border-none opacity-0 group-hover:opacity-100 transition-opacity rounded-full w-10 h-10 sm:w-12 sm:h-12 focus:opacity-100"
      >
        <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={nextSlide}
        disabled={isAnimating}
        aria-label="Next slide"
        className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 text-white border-none opacity-0 group-hover:opacity-100 transition-opacity rounded-full w-10 h-10 sm:w-12 sm:h-12 focus:opacity-100"
      >
        <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7" />
      </Button>

      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2.5">
        {slidesData.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            disabled={isAnimating && currentIndex !== index}
            aria-label={`Go to slide ${index + 1}`}
            className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-white scale-125 shadow-md' : 'bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
