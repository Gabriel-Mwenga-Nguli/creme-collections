
import React from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface LogoIconProps {
  className?: string;
}

const LogoIcon = ({ className }: LogoIconProps) => {
  return (
    <Image 
      src="/logo.svg" 
      alt="Creme Collections Logo" 
      width={140} 
      height={32} 
      className={cn("h-8 w-auto", className)}
      priority
    />
  );
};

export default LogoIcon;
