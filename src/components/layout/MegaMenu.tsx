
"use client";

import Link from 'next/link';
import { type NavLink } from '@/lib/constants';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MegaMenuProps {
  categories: NavLink[];
  onClose: () => void;
}

export default function MegaMenu({ categories, onClose }: MegaMenuProps) {
  return (
    <div 
      className="absolute top-full left-0 w-full bg-background shadow-2xl border-t border-border z-40 animate-in fade-in-0 slide-in-from-top-2 duration-200"
      onMouseLeave={onClose} // Optional: close on mouse leave
    >
      <div className="container max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-4 right-4 md:hidden" 
          onClick={onClose}
          aria-label="Close menu"
        >
          <X className="h-6 w-6" />
        </Button>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-6 gap-y-8">
          {categories.map((category) => (
            <div key={category.label} className="space-y-3">
              <h3 className="text-md font-semibold text-primary hover:text-primary/80 transition-colors">
                <Link href={category.href} onClick={onClose} className="flex items-center gap-2">
                  {category.icon && <category.icon className="h-5 w-5" />}
                  {category.label}
                </Link>
              </h3>
              {category.subLinks && category.subLinks.length > 0 && (
                <ul className="space-y-1.5">
                  {category.subLinks.map((subLink) => (
                    <li key={subLink.label}>
                      <Link
                        href={subLink.href}
                        onClick={onClose}
                        className="block text-sm text-muted-foreground hover:text-primary hover:underline transition-colors"
                      >
                        {subLink.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
