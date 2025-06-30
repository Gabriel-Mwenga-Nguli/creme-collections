"use client";

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import LogoIcon from '@/components/LogoIcon';

export default function Preloader() {
  const [isMounted, setIsMounted] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden'; // Prevent scrolling while preloader is active

    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 1200); // Start fading

    const unmountTimer = setTimeout(() => {
      setIsMounted(false);
      document.body.style.overflow = ''; // Restore scrolling
    }, 1500); // Unmount after fade

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(unmountTimer);
      document.body.style.overflow = ''; // Ensure scrolling is restored on component unmount
    };
  }, []);

  if (!isMounted) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[200] flex items-center justify-center bg-slate-900 transition-opacity duration-300 ease-in-out",
        isFading ? 'opacity-0' : 'opacity-100'
      )}
    >
      <div className="animate-pulse">
        <LogoIcon className="h-16 w-auto text-slate-100" />
      </div>
    </div>
  );
}
