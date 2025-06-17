
"use client";

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Slide {
  id: number;
  image: string;
  dataAiHint: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  textAlign?: 'left' | 'center' | 'right';
  textColor?: string; // e.g. 'text-white'
  overlayColor?: string; // e.g. 'bg-black/50'
}

const slidesData: Slide[] = [
  {
    id: 1,
    image: 'https://placehold.co/1600x800.png',
    dataAiHint: 'fashion sale',
    title: 'Summer Collection is Here!',
    subtitle: 'Discover vibrant styles and fresh looks for the season.',
    buttonText: 'Shop Now',
    buttonLink: '/products?category=summer',
    textAlign: 'left',
    textColor: 'text-white',
    overlayColor: 'bg-black/40'
  },
  {
    id: 2,
    image: 'https://placehold.co/1600x800.png',
    dataAiHint: 'electronics gadgets',
    title: 'Latest Tech Gadgets',
    subtitle: 'Upgrade your life with cutting-edge technology.',
    buttonText: 'Explore Tech',
    buttonLink: '/products?category=electronics',
    textAlign: 'center',
    textColor: 'text-white',
    overlayColor: 'bg-primary/30'
  },
  {
    id: 3,
    image: 'https://placehold.co/1600x800.png',
    dataAiHint: 'home decor',
    title: 'Transform Your Home',
    subtitle: 'Find elegant decor and furnishings for every room.',
    buttonText: 'Discover Home Goods',
    buttonLink: '/products?category=home',
    textAlign: 'right',
    textColor: 'text-foreground', // Better for lighter overlay or no overlay
    overlayColor: 'bg-accent/20'
  },
];

const HeroSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === slidesData.length - 1 ? 0 : prevIndex + 1));
  }, []);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? slidesData.length - 1 : prevIndex - 1));
  };

  useEffect(() => {
    const slideInterval = setInterval(nextSlide, 7000); // Auto-slide every 7 seconds
    return () => clearInterval(slideInterval);
  }, [nextSlide]);

  const currentSlide = slidesData[currentIndex];

  const textAlignClasses = {
    left: 'items-start text-left',
    center: 'items-center text-center',
    right: 'items-end text-right',
  };

  return (
    <section className="relative w-full h-[calc(100vh-120px)] min-h-[400px] max-h-[700px] overflow-hidden group">
      {slidesData.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            layout="fill"
            objectFit="cover"
            priority={index === 0}
            className="transition-transform duration-\[7000ms\] ease-linear group-hover:scale-105"
            data-ai-hint={slide.dataAiHint}
          />
          <div className={`absolute inset-0 ${slide.overlayColor || 'bg-black/30'}`} />
          <div className={`absolute inset-0 container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center ${textAlignClasses[slide.textAlign || 'left']} ${slide.textColor || 'text-white'} p-8 md:p-16`}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold drop-shadow-lg font-headline leading-tight">
              {slide.title}
            </h1>
            <p className="mt-4 text-lg sm:text-xl md:text-2xl max-w-xl drop-shadow-md">
              {slide.subtitle}
            </p>
            <Button size="lg" className="mt-8 w-fit" asChild>
              <Link href={slide.buttonLink}>{slide.buttonText}</Link>
            </Button>
          </div>
        </div>
      ))}

      <Button
        variant="outline"
        size="icon"
        onClick={prevSlide}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-background/50 hover:bg-background/80 text-foreground opacity-0 group-hover:opacity-100 transition-opacity rounded-full w-10 h-10 sm:w-12 sm:h-12"
      >
        <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={nextSlide}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-background/50 hover:bg-background/80 text-foreground opacity-0 group-hover:opacity-100 transition-opacity rounded-full w-10 h-10 sm:w-12 sm:h-12"
      >
        <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7" />
      </Button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {slidesData.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-primary scale-125' : 'bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
