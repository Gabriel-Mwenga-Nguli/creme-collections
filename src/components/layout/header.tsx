
"use client";

import Link from 'next/link';
import { Menu, X, Sun, Moon, Heart, ShoppingCart, User, ChevronDown, type LucideIcon } from 'lucide-react';
import { useState, useEffect, forwardRef, ElementRef, ComponentPropsWithoutRef } from 'react';
import Logo from '@/components/logo';
import { MAIN_NAV_LINKS, CATEGORY_NAV_LINKS, type NavLink } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { useTheme } from 'next-themes';
import { useIsMobile } from '@/hooks/use-mobile';
import AISearchBar from '@/components/features/search/AISearchBar';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import MegaMenu from './MegaMenu';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from '@/lib/utils';

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

const ListItem = forwardRef<
  ElementRef<"a">,
  ComponentPropsWithoutRef<"a"> & { title: string }
>(({ className, title, children, href, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href!}
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          {children && (
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          )}
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default function Header() {
  const isMobile = useIsMobile();
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);

  useEffect(() => {
    if (isMobile && isMegaMenuOpen) {
      setIsMegaMenuOpen(false); // Close mega menu on mobile view
    }
  }, [isMobile, isMegaMenuOpen]);

  const toggleMegaMenu = () => {
    if (!isMobile) {
      setIsMegaMenuOpen(!isMegaMenuOpen);
    }
  };
  
  const closeMegaMenu = () => setIsMegaMenuOpen(false);


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
              <Sheet onOpenChange={(open) => { if (!open) closeMegaMenu(); }}>
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

                    <nav className="flex flex-col gap-1 mb-4">
                       {MAIN_NAV_LINKS.map((link) => (
                         <SheetClose asChild key={link.label}>
                            <Link
                              href={link.href}
                              className="flex items-center gap-2 py-2 px-2 rounded-md text-base font-medium text-foreground hover:bg-muted hover:text-primary"
                            >
                              {link.icon && <link.icon className="h-5 w-5 text-muted-foreground" />}
                              {link.label}
                            </Link>
                         </SheetClose>
                       ))}
                    </nav>
                    
                    <hr className="my-3"/>
                    <p className="px-2 text-sm font-semibold text-muted-foreground mb-2">Browse Categories</p>
                    <Accordion type="single" collapsible className="w-full">
                      {CATEGORY_NAV_LINKS.map((category) => (
                        <AccordionItem value={category.label} key={category.label}>
                          <AccordionTrigger className="text-base font-medium hover:text-primary py-3 px-2">
                            <div className="flex items-center gap-2">
                              {category.icon && <category.icon className="h-5 w-5 text-muted-foreground" />}
                              {category.label}
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pl-6 pr-2">
                            <nav className="flex flex-col gap-1.5 mt-1">
                              <SheetClose asChild>
                                <Link href={category.href} className="text-sm text-muted-foreground hover:text-primary py-1.5 block">All {category.label}</Link>
                              </SheetClose>
                              {category.subLinks?.map((subLink) => (
                                <SheetClose asChild key={subLink.label}>
                                  <Link
                                    href={subLink.href}
                                    className="text-sm text-muted-foreground hover:text-primary py-1.5 block"
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
                     <SheetClose asChild>
                         <Link href="/profile" className="text-base font-medium text-foreground hover:text-primary flex items-center gap-2 py-2 px-2">
                             <User className="h-5 w-5 text-muted-foreground" /> Profile
                         </Link>
                     </SheetClose>
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
          <div className="flex h-12 items-center justify-start border-t border-border/20 bg-primary/5 relative">
            <nav className="flex gap-1 items-center"> {/* Removed overflow-x-auto scrollbar-hide */}
              {MAIN_NAV_LINKS.find(link => link.isMegaMenuTrigger) && (() => {
                const megaMenuTriggerLink = MAIN_NAV_LINKS.find(link => link.isMegaMenuTrigger)!;
                return (
                    <Button
                        key={megaMenuTriggerLink.label}
                        variant="ghost"
                        onClick={toggleMegaMenu}
                        className={`text-sm font-medium px-3 py-2 h-auto rounded-md hover:bg-primary/20 hover:text-primary ${isMegaMenuOpen ? 'bg-primary/15 text-primary' : 'text-foreground'}`}
                    >
                        {megaMenuTriggerLink.icon && <megaMenuTriggerLink.icon className="mr-1.5 h-4 w-4" />}
                        {megaMenuTriggerLink.label}
                        <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${isMegaMenuOpen ? 'rotate-180' : ''}`} />
                    </Button>
                );
              })()}
              
              <NavigationMenu className="ml-1">
                <NavigationMenuList>
                  {MAIN_NAV_LINKS.filter(link => !link.isMegaMenuTrigger).map((link) => {
                    const parentCategoryData = CATEGORY_NAV_LINKS.find(cat => cat.href === link.href);

                    if (parentCategoryData && parentCategoryData.subLinks && parentCategoryData.subLinks.length > 0) {
                      return (
                        <NavigationMenuItem key={link.label}>
                          <NavigationMenuTrigger 
                            className="text-sm font-medium px-3 py-2 h-auto rounded-md text-foreground hover:bg-primary/20 hover:text-primary bg-transparent focus:bg-primary/10 data-[state=open]:bg-primary/10"
                          >
                            {link.icon && <link.icon className="mr-1.5 h-4 w-4" />}
                            {link.label}
                          </NavigationMenuTrigger>
                          <NavigationMenuContent>
                            <ul className="flex flex-col w-[250px] gap-1 p-2 md:w-[300px] bg-popover border rounded-md shadow-lg">
                               <ListItem
                                  key={`all-${parentCategoryData.label}`}
                                  href={parentCategoryData.href}
                                  title={`All ${parentCategoryData.label}`}
                                  onClick={closeMegaMenu}
                                  className="font-semibold"
                                >
                                  Browse all items in {parentCategoryData.label}.
                                </ListItem>
                                <hr className="my-1"/>
                              {parentCategoryData.subLinks.map((subLink) => (
                                <ListItem
                                  key={subLink.label}
                                  href={subLink.href}
                                  title={subLink.label}
                                  onClick={closeMegaMenu}
                                />
                              ))}
                            </ul>
                          </NavigationMenuContent>
                        </NavigationMenuItem>
                      );
                    } else {
                      return (
                        <NavigationMenuItem key={link.label}>
                          <Link href={link.href} legacyBehavior passHref>
                            <NavigationMenuLink 
                              className={cn(navigationMenuTriggerStyle(), "text-sm font-medium px-3 py-2 h-auto rounded-md text-foreground hover:bg-primary/20 hover:text-primary bg-transparent focus:bg-primary/10")}
                              onClick={closeMegaMenu}
                            >
                              {link.icon && <link.icon className="mr-1.5 h-4 w-4" />}
                              {link.label}
                            </NavigationMenuLink>
                          </Link>
                        </NavigationMenuItem>
                      );
                    }
                  })}
                </NavigationMenuList>
              </NavigationMenu>
            </nav>
          </div>
        )}
      </div>
      {!isMobile && isMegaMenuOpen && (
        <MegaMenu categories={CATEGORY_NAV_LINKS} onClose={closeMegaMenu} />
      )}
    </header>
  );
}

