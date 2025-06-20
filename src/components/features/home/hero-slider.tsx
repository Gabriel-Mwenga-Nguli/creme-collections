
"use client";

import { useState, useEffect, useCallback } from 'react';
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
  contentAnimation?: string; // e.g., 'animate-slide-in-left'
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
    textColor: 'text-slate-800', // Kept as per previous update, assuming it's intentional
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
    textColor: 'text-white', // Changed for better visibility
    overlayColor: 'bg-black/30', // Changed for better visibility
    titleSize: 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl',
    subtitleSize: 'text-lg sm:text-xl md:text-2xl',
    contentAnimation: 'animate-fade-in-left'
  }
];

const HeroSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(slidesData.length - 1); 

  const nextSlide = useCallback(() => {
    setPrevIndex(currentIndex);
    setCurrentIndex((prev) => (prev === slidesData.length - 1 ? 0 : prev + 1));
  }, [currentIndex]);

  const prevSlide = useCallback(() => {
    setPrevIndex(currentIndex);
    setCurrentIndex((prev) => (prev === 0 ? slidesData.length - 1 : prev - 1));
  }, [currentIndex]);

  useEffect(() => {
    const slideInterval = setInterval(nextSlide, 7000); 
    return () => clearInterval(slideInterval);
  }, [nextSlide]);

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
                "transition-transform duration-[7.5s] ease-linear", // Changed 7500ms to 7.5s
                index === currentIndex ? 'scale-110 animate-kenburns' : 'scale-100'
              )}
              data-ai-hint={slide.dataAiHint}
              sizes="100vw"
            />
          </div>
          <div className={`absolute inset-0 ${slide.overlayColor || 'bg-black/30'}`} />
          <div
            className={cn(
              `absolute inset-0 container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center ${textAlignClasses[slide.textAlign || 'left']} ${slide.textColor || 'text-white'} p-6 md:p-12 lg:p-20`,
              index === currentIndex ? 'animate-fade-in opacity-100' : 'opacity-0',
              index === prevIndex ? 'animate-fade-out' : '' 
            )}
            style={{ animationDelay: index === currentIndex ? '0.5s' : '0s' }}
          >
            <h1 className={cn(`${slide.titleSize || 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl'} font-extrabold drop-shadow-lg font-headline leading-tight max-w-2xl`, index === currentIndex && slide.contentAnimation)}>
              {slide.title}
            </h1>
            <p className={cn(`${slide.subtitleSize || 'text-lg sm:text-xl md:text-2xl'} mt-4 max-w-lg drop-shadow-lg`, index === currentIndex && slide.contentAnimation)} style={{animationDelay: index === currentIndex ? '0.2s' : '0s' }}>
              {slide.subtitle}
            </p>
            <Button
              asChild
              size="lg"
              className={cn("mt-6 md:mt-8 w-fit text-base md:text-lg px-6 md:px-8 py-3 md:py-4 font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95", index === currentIndex && slide.contentAnimation)}
              style={{animationDelay: index === currentIndex ? '0.4s' : '0s' }}
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
        aria-label="Previous slide"
        className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 text-white border-none opacity-0 group-hover:opacity-100 transition-opacity rounded-full w-10 h-10 sm:w-12 sm:h-12 focus:opacity-100"
      >
        <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={nextSlide}
        aria-label="Next slide"
        className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 text-white border-none opacity-0 group-hover:opacity-100 transition-opacity rounded-full w-10 h-10 sm:w-12 sm:h-12 focus:opacity-100"
      >
        <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7" />
      </Button>

      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2.5">
        {slidesData.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setPrevIndex(currentIndex);
              setCurrentIndex(index);
            }}
            aria-label={`Go to slide ${index + 1}`}
            className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-white scale-125 shadow-md' : 'bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
      <style jsx global>{`
        @keyframes kenburns {
          0% {
            transform: scale(1) translate(0, 0);
          }
          100% {
            transform: scale(1.1) translate(-1%, 1%);
          }
        }
        .animate-kenburns {
          animation: kenburns 7.5s ease-in-out infinite alternate;
        }
        .animate-fade-in-right {
            animation: fadeInRight 0.8s ease-out forwards;
        }
        .animate-fade-in-left {
            animation: fadeInLeft 0.8s ease-out forwards;
        }
        .animate-fade-in-up {
            animation: fadeInUp 0.8s ease-out forwards;
        }
        .animate-fade-in {
            animation: fadeIn 0.8s ease-out forwards;
        }
         .animate-fade-out {
            animation: fadeOut 0.5s ease-in forwards;
        }

        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
         @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
      `}</style>
    </section>
  );
};

export default HeroSlider;
