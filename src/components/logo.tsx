import Link from 'next/link';
import LogoIcon from './LogoIcon'; // Import the new component
import { cn } from '@/lib/utils';

const Logo = ({ className }: { className?: string }) => {
  return (
    <Link 
      href="/" 
      className="block group"
      aria-label="Creme Collections Home"
    >
      <LogoIcon className={cn('h-8 w-auto group-hover:opacity-80 transition-opacity', className)} />
    </Link>
  );
};

export default Logo;
