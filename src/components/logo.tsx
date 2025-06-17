import Link from 'next/link';
import { SITE_NAME } from '@/lib/constants';

const Logo = ({ className }: { className?: string }) => {
  return (
    <Link 
      href="/" 
      className={`text-2xl font-bold text-primary hover:opacity-80 transition-opacity font-headline ${className}`}
    >
      {SITE_NAME}
    </Link>
  );
};

export default Logo;
