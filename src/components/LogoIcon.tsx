import React from 'react';
import { cn } from '@/lib/utils';

interface LogoIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

const LogoIcon = ({ className, ...props }: LogoIconProps) => {
  return (
    <svg
      viewBox="0 0 200 40"
      className={cn("h-10 w-auto text-primary", className)}
      {...props}
      aria-label="Creme Collections"
    >
      <text
        x="0"
        y="30"
        fontFamily="Inter, sans-serif"
        fontSize="32"
        fontWeight="bold"
        fill="currentColor"
      >
        Creme
      </text>
      <text
        x="105"
        y="29"
        fontFamily="Inter, sans-serif"
        fontSize="12"
        letterSpacing="0.1em"
        fill="currentColor"
        opacity="0.9"
      >
        COLLECTIONS
      </text>
    </svg>
  );
};

export default LogoIcon;
