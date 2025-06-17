"use client";

import Link from 'next/link';
import { Menu, Search, ShoppingCart, User, X, Sun, Moon, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import Logo from '@/components/logo';
import { NAV_LINKS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { useTheme } from 'next-themes';
import { useIsMobile } from '@/hooks/use-mobile'; // Assuming useIsMobile hook checks screen width

const ThemeToggle = () => {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <Button variant="ghost" size="icon" className="w-9 h-9" disabled><Sun className="h-[1.2rem] w-[1.2rem]" /></Button>;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      className="w-9 h-9"
    >
      {theme === 'light' ? (
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      )}
    </Button>
  );
};


export default function Header() {
  const isMobile = useIsMobile();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />
        
        {isMobile ? (
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] p-6 bg-background">
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-center mb-6">
                     <Logo />
                    <SheetClose asChild>
                       <Button variant="ghost" size="icon" aria-label="Close menu">
                         <X className="h-6 w-6" />
                       </Button>
                    </SheetClose>
                  </div>
                  <nav className="flex flex-col gap-4">
                    {NAV_LINKS.map((link) => (
                      <SheetClose asChild key={link.label}>
                        <Link
                          href={link.href}
                          className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                        >
                          {link.label}
                        </Link>
                      </SheetClose>
                    ))}
                  </nav>
                  <div className="mt-auto flex flex-col gap-4">
                     <Button variant="outline" className="w-full" asChild>
                        <Link href="/login">Login</Link>
                     </Button>
                     <Button className="w-full" asChild>
                        <Link href="/register">Register</Link>
                     </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        ) : (
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex gap-6">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" asChild aria-label="Search">
                <Link href="/search-page"><Search className="h-[1.2rem] w-[1.2rem]" /></Link>
              </Button>
              <Button variant="ghost" size="icon" asChild aria-label="Wishlist">
                <Link href="/wishlist"><Heart className="h-[1.2rem] w-[1.2rem]" /></Link>
              </Button>
              <Button variant="ghost" size="icon" asChild aria-label="Shopping Cart">
                <Link href="/cart"><ShoppingCart className="h-[1.2rem] w-[1.2rem]" /></Link>
              </Button>
              <Button variant="ghost" size="icon" asChild aria-label="User Profile">
                <Link href="/profile"><User className="h-[1.2rem] w-[1.2rem]" /></Link>
              </Button>
              <ThemeToggle />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
