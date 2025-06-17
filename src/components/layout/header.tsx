
"use client";

import Link from 'next/link';
import { Menu, X, Sun, Moon, Heart, ShoppingCart, User, ChevronDown, Briefcase } from 'lucide-react';
import { useState, useEffect } from 'react';
import Logo from '@/components/logo';
import { HEADER_NAV_LINKS, CATEGORY_NAV_LINKS, type NavLink } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { useTheme } from 'next-themes';
import { useIsMobile } from '@/hooks/use-mobile';
import CategoryDropdown from './CategoryDropdown'; // New component
import AISearchBar from '@/components/features/search/AISearchBar'; // New component
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

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
      className="w-9 h-9 text-foreground hover:text-primary"
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
      <div className="container max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        {/* Top Row */}
        <div className="flex h-16 items-center justify-between gap-4">
          <Logo />
          {!isMobile && (
            <div className="flex-1 max-w-xl">
              <AISearchBar />
            </div>
          )}
          <div className="flex items-center gap-1 sm:gap-2">
            {!isMobile && (
                <>
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/login" className="text-xs sm:text-sm">Login</Link>
                    </Button>
                    <Button variant="default" size="sm" asChild>
                        <Link href="/register" className="text-xs sm:text-sm">Register</Link>
                    </Button>
                </>
            )}
            <Button variant="ghost" size="icon" asChild aria-label="Wishlist" className="text-foreground hover:text-primary">
              <Link href="/wishlist"><Heart className="h-5 w-5" /></Link>
            </Button>
            <Button variant="ghost" size="icon" asChild aria-label="Shopping Cart" className="text-foreground hover:text-primary">
              <Link href="/cart"><ShoppingCart className="h-5 w-5" /></Link>
            </Button>
             {!isMobile && (
                 <Button variant="ghost" size="icon" asChild aria-label="User Profile" className="text-foreground hover:text-primary">
                    <Link href="/profile"><User className="h-5 w-5" /></Link>
                 </Button>
             )}
            <ThemeToggle />
            {isMobile && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Open menu" className="text-foreground hover:text-primary">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[320px] p-0 bg-background flex flex-col">
                  <div className="flex justify-between items-center p-4 border-b">
                     <Logo />
                    <SheetClose asChild>
                       <Button variant="ghost" size="icon" aria-label="Close menu">
                         <X className="h-6 w-6" />
                       </Button>
                    </SheetClose>
                  </div>
                  
                  <div className="p-4 flex-1 overflow-y-auto">
                    <div className="mb-4">
                      <AISearchBar />
                    </div>

                    <Accordion type="single" collapsible className="w-full">
                      {CATEGORY_NAV_LINKS.map((category) => (
                        <AccordionItem value={category.label} key={category.label}>
                          <AccordionTrigger className="text-base font-medium hover:text-primary py-3">
                            <div className="flex items-center gap-2">
                              {category.icon && <category.icon className="h-5 w-5 text-muted-foreground" />}
                              {category.label}
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pl-4">
                            <nav className="flex flex-col gap-2 mt-1">
                              <SheetClose asChild>
                                <Link href={category.href} className="text-sm text-muted-foreground hover:text-primary py-1">All {category.label}</Link>
                              </SheetClose>
                              {category.subLinks?.map((subLink) => (
                                <SheetClose asChild key={subLink.label}>
                                  <Link
                                    href={subLink.href}
                                    className="text-sm text-muted-foreground hover:text-primary py-1"
                                  >
                                    {subLink.label}
                                  </Link>
                                </SheetClose>
                              ))}
                            </nav>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>

                    <hr className="my-4" />

                    <nav className="flex flex-col gap-3">
                      {HEADER_NAV_LINKS.map((link) => (
                        <SheetClose asChild key={link.label}>
                          <Link
                            href={link.href}
                            className="text-base font-medium text-foreground hover:text-primary flex items-center gap-2 py-2"
                          >
                             {link.icon && <link.icon className="h-5 w-5 text-muted-foreground" />}
                            {link.label}
                          </Link>
                        </SheetClose>
                      ))}
                       <SheetClose asChild>
                           <Link href="/profile" className="text-base font-medium text-foreground hover:text-primary flex items-center gap-2 py-2">
                               <User className="h-5 w-5 text-muted-foreground" /> Profile
                           </Link>
                       </SheetClose>
                    </nav>
                  </div>

                  <div className="p-4 border-t mt-auto">
                     <div className="flex flex-col gap-2">
                        <SheetClose asChild>
                         <Button variant="outline" className="w-full" asChild>
                            <Link href="/login">Login</Link>
                         </Button>
                        </SheetClose>
                        <SheetClose asChild>
                         <Button className="w-full" asChild>
                            <Link href="/register">Register</Link>
                         </Button>
                        </SheetClose>
                     </div>
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>

        {/* Bottom Row - Desktop Only */}
        {!isMobile && (
          <div className="flex h-12 items-center justify-between border-t border-border/20">
            <div className="flex items-center gap-6">
              <CategoryDropdown />
              <nav className="flex gap-4">
                {HEADER_NAV_LINKS.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
                  >
                    {link.icon && <link.icon className="h-4 w-4" />}
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
