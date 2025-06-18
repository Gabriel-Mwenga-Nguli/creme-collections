
"use client";

import Link from 'next/link';
import { Menu, X, Sun, Moon, Heart, ShoppingCart, User as UserIconLucide, ChevronDown, type LucideIcon, BarChart3 } from 'lucide-react';
import { useState, useEffect, forwardRef, ElementRef, ComponentPropsWithoutRef, useCallback } from 'react';
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
import { useCart } from '@/context/CartContext';
import { Badge } from '@/components/ui/badge';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';

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
  Omit<ComponentPropsWithoutRef<typeof Link>, "href"> & { title: string; href: string; onClick?: () => void; }
>(({ className, title, children, href, onClick, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-slate-800 focus:bg-slate-800 group/listitem",
            className
          )}
          onClick={onClick}
          {...props}
        >
          <>
            <div className="text-sm font-medium leading-none text-slate-100 group-hover/listitem:text-primary">{title}</div>
            {children && (
              <p className="line-clamp-2 text-sm leading-snug text-slate-400">
                {children}
              </p>
            )}
          </>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default function Header() {
  const isMobile = useIsMobile();
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const { getCartItemCount } = useCart();
  const cartItemCount = getCartItemCount();
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!auth) {
      console.warn("[Header] Firebase auth is not initialized. User state won't be tracked.");
      setAuthLoading(false);
      setCurrentUser(null);
      setIsAdmin(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user && user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);


  useEffect(() => {
    if (isMobile && isMegaMenuOpen) {
      setIsMegaMenuOpen(false);
    }
  }, [isMobile, isMegaMenuOpen]);

  const toggleMegaMenu = useCallback(() => {
    if (!isMobile) {
      setIsMegaMenuOpen(prev => !prev);
    }
  }, [isMobile]);

  const closeMegaMenu = useCallback(() => setIsMegaMenuOpen(false), []);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);

  const accountLink = currentUser ? "/profile" : "/login";


  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        {/* Top Row */}
        <div className="flex h-16 items-center justify-between gap-2 md:gap-4">
          <div className="flex-shrink-0">
            <Logo />
          </div>
          {!isMobile && (
            <div className="flex-1 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xl">
              <AISearchBar />
            </div>
          )}
          <div className="flex items-center gap-0.5 sm:gap-1 md:gap-2">
            {isAdmin && !isMobile && (
              <Button asChild variant="outline" size="sm" className="text-xs sm:text-sm px-2 md:px-3 mr-2 border-primary text-primary hover:bg-primary/10">
                <Link href="/admin/dashboard">
                  <span> {/* Wrap icon and text in a single span */}
                    <BarChart3 className="mr-1.5 h-3.5 w-3.5"/>Admin
                  </span>
                </Link>
              </Button>
            )}
            {!isMobile && !authLoading && !currentUser && (
                <>
                    <Button asChild variant="outline" size="sm" className="text-xs sm:text-sm px-2 md:px-3">
                      <Link href="/login">Login</Link>
                    </Button>
                    <Button asChild variant="default" size="sm" className="text-xs sm:text-sm px-2 md:px-3">
                      <Link href="/register">Register</Link>
                    </Button>
                </>
            )}
            <Button asChild variant="ghost" size="icon" aria-label="Wishlist" className="text-foreground hover:text-primary w-8 h-8 sm:w-9 sm:h-9">
              <Link href="/wishlist">
                <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="icon" aria-label="Shopping Cart" className="relative text-foreground hover:text-primary w-8 h-8 sm:w-9 sm:h-9">
              <Link href="/cart">
                <>
                  <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                  {cartItemCount > 0 && (
                    <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 min-w-[0.75rem] p-[2px] text-[10px] flex items-center justify-center leading-none">
                      {cartItemCount}
                    </Badge>
                  )}
                </>
              </Link>
            </Button>
             {!isMobile && (
                <Button asChild variant="ghost" size="icon" aria-label="User Account" className="text-foreground hover:text-primary w-8 h-8 sm:w-9 sm:h-9" disabled={authLoading}>
                  <Link href={accountLink}>
                    <UserIconLucide className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Link>
                </Button>
             )}
            <ThemeToggle />
            {isMobile && (
              <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Open menu" className="text-foreground hover:text-primary w-8 h-8 sm:w-9 sm:h-9">
                    <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
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
                       {MAIN_NAV_LINKS.filter(link => !link.isMegaMenuTrigger).map((link) => (
                         <SheetClose asChild key={link.label}>
                            <Link
                              href={link.href}
                              className="flex items-center gap-2 py-2 px-2 rounded-md text-base font-medium text-foreground hover:bg-muted hover:text-primary"
                            >
                              <span> {/* Wrap icon and text */}
                                {link.icon && <link.icon className="h-5 w-5 text-muted-foreground inline-block mr-1" />}
                                {link.label}
                              </span>
                            </Link>
                         </SheetClose>
                       ))}
                       {isAdmin && (
                         <SheetClose asChild>
                            <Link
                              href="/admin/dashboard"
                              className="flex items-center gap-2 py-2 px-2 rounded-md text-base font-medium text-primary hover:bg-primary/10"
                            >
                              <span> {/* Wrap icon and text */}
                                <BarChart3 className="h-5 w-5 text-primary inline-block mr-1" />
                                Admin Dashboard
                              </span>
                            </Link>
                         </SheetClose>
                       )}
                    </nav>

                    <hr className="my-3"/>
                    <p className="px-2 text-sm font-semibold text-muted-foreground mb-2">Browse Categories</p>
                    <Accordion type="single" collapsible className="w-full">
                      {CATEGORY_NAV_LINKS.map((category) => (
                        <AccordionItem value={category.label} key={category.label}>
                          <AccordionTrigger className="text-base font-medium hover:text-primary py-3 px-2" asChild>
                            <SheetClose asChild>
                                <Link href={category.href} className="flex items-center gap-2 w-full text-left" onClick={(e) => e.stopPropagation()}>
                                   <span> {/* Wrap icon and text */}
                                    {category.icon && <category.icon className="h-5 w-5 text-muted-foreground inline-block mr-2" />}
                                    {category.label}
                                   </span>
                                </Link>
                            </SheetClose>
                          </AccordionTrigger>
                          <AccordionContent className="pl-6 pr-2">
                            <nav className="flex flex-col gap-1.5 mt-1">
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
                         <Link href={authLoading ? "/login" : accountLink} className="text-base font-medium text-foreground hover:text-primary flex items-center gap-2 py-2 px-2">
                            <span> {/* Wrap icon and text */}
                             <UserIconLucide className="h-5 w-5 text-muted-foreground inline-block mr-1" />
                             {currentUser ? "My Account" : "Login / Profile"}
                            </span>
                         </Link>
                     </SheetClose>
                  </div>

                  <div className="p-4 border-t mt-auto">
                     {authLoading ? (
                        <p className="text-sm text-muted-foreground text-center">Loading user...</p>
                     ) : currentUser ? (
                       <SheetClose asChild>
                           <Button variant="outline" className="w-full" onClick={() => auth?.signOut()}>Logout</Button>
                       </SheetClose>
                     ) : (
                       <div className="flex flex-col gap-2">
                          <SheetClose asChild>
                            <Button asChild variant="outline" className="w-full">
                               <Link href="/login">Login</Link>
                            </Button>
                          </SheetClose>
                          <SheetClose asChild>
                            <Button asChild className="w-full">
                                <Link href="/register">Register</Link>
                            </Button>
                          </SheetClose>
                       </div>
                     )}
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>

        {!isMobile && (
          <div className="flex h-12 items-center justify-start border-t border-border/20 bg-primary/5 relative">
            <nav className="flex gap-1 items-center flex-wrap">
              {MAIN_NAV_LINKS.find(link => link.isMegaMenuTrigger) && (() => {
                const megaMenuTriggerLink = MAIN_NAV_LINKS.find(link => link.isMegaMenuTrigger)!;
                return (
                    <Button
                        key={megaMenuTriggerLink.label}
                        variant="ghost"
                        onClick={toggleMegaMenu}
                        onMouseEnter={toggleMegaMenu}
                        className={`text-sm font-medium px-2 md:px-3 py-2 h-auto rounded-md hover:bg-primary/20 hover:text-primary ${isMegaMenuOpen ? 'bg-slate-800 text-slate-100 hover:bg-slate-700' : 'text-foreground'}`}
                    >
                      <span> {/* Wrap icon and text */}
                        {megaMenuTriggerLink.icon && <megaMenuTriggerLink.icon className={`mr-1.5 h-4 w-4 ${isMegaMenuOpen ? 'text-slate-100' : ''}`} />}
                        {megaMenuTriggerLink.label}
                        <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${isMegaMenuOpen ? 'rotate-180 text-slate-100' : ''}`} />
                      </span>
                    </Button>
                );
              })()}

              <NavigationMenu>
                <NavigationMenuList className="flex-wrap justify-start">
                  {MAIN_NAV_LINKS.filter(link => !link.isMegaMenuTrigger).map((link) => {
                    const parentCategoryData = CATEGORY_NAV_LINKS.find(cat => cat.href === link.href);

                    if (parentCategoryData && parentCategoryData.subLinks && parentCategoryData.subLinks.length > 0) {
                      return (
                        <NavigationMenuItem key={link.label}>
                          <NavigationMenuTrigger
                            className={cn(navigationMenuTriggerStyle(),"text-sm font-medium px-2 md:px-3 py-2 h-auto rounded-md text-foreground hover:bg-primary/20 hover:text-primary bg-transparent focus:bg-primary/10 data-[state=open]:bg-slate-800 data-[state=open]:text-slate-100 group")}
                          >
                             <Link href={link.href} onClick={closeMegaMenu}>
                                <span> {/* Wrap icon and text */}
                                {link.icon && <link.icon className="mr-1.5 h-4 w-4 group-hover:text-primary transition-colors inline-block" />}
                                {link.label}
                                </span>
                            </Link>
                          </NavigationMenuTrigger>
                          <NavigationMenuContent className="bg-slate-900 border-slate-700 text-slate-100">
                            <ul className="flex flex-col w-[220px] md:w-[250px] lg:w-[300px] gap-1 p-2 rounded-md shadow-lg max-h-[70vh] overflow-y-auto">
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
                           <NavigationMenuLink asChild>
                            <Link
                              href={link.href}
                              className={cn(navigationMenuTriggerStyle(), "text-sm font-medium px-2 md:px-3 py-2 h-auto rounded-md text-foreground hover:bg-primary/20 hover:text-primary bg-transparent focus:bg-primary/10 group")}
                              onClick={closeMegaMenu}
                            >
                             <span> {/* Wrap icon and text */}
                              {link.icon && <link.icon className="mr-1.5 h-4 w-4 group-hover:text-primary transition-colors inline-block" />}
                              {link.label}
                             </span>
                            </Link>
                          </NavigationMenuLink>
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

    