
"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth, db } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import Logo from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LayoutDashboard, ShoppingBag, ListOrdered, Settings, LogOut, Menu as MenuIcon, Loader2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const SHOP_MANAGER_EMAIL = process.env.NEXT_PUBLIC_SHOP_MANAGER_EMAIL;

interface ShopManagerNavLink {
  href: string;
  label: string;
  icon: React.ElementType;
}

const SHOP_MANAGER_NAV_LINKS: ShopManagerNavLink[] = [
  { href: '/shop-manager/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/shop-manager/my-products', label: 'My Products', icon: ShoppingBag },
  { href: '/shop-manager/my-orders', label: 'My Orders', icon: ListOrdered },
  // Add more links like Settings if needed
];

function ShopManagerSidebarContent({ closeSheet }: { closeSheet?: () => void }) {
  const [user] = useAuthState(auth);
  const router = useRouter();

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/login');
    if (closeSheet) closeSheet();
  };
  
  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'SM';
    const nameParts = name.split(' ');
    if (nameParts.length > 1) return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      <div className="p-4 border-b border-sidebar-border">
        <Link href="/shop-manager/dashboard" onClick={closeSheet}>
          <Logo className="text-xl text-primary"/>
        </Link>
         <p className="text-xs text-muted-foreground mt-1">Shop Manager Panel</p>
      </div>
      {user && (
        <div className="p-3 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'Shop Manager'} />
              <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xs font-medium">{user.displayName || 'Shop Manager'}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </div>
      )}
      <ScrollArea className="flex-grow">
        <nav className="p-3 space-y-1">
          {SHOP_MANAGER_NAV_LINKS.map((link) => (
             <SheetClose asChild key={link.label}>
              <Button
                as="a"
                href={link.href}
                variant="ghost"
                className="w-full justify-start text-sm font-normal text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <span>
                  <link.icon className="mr-2 h-4 w-4 inline-block" />
                  {link.label}
                </span>
              </Button>
            </SheetClose>
          ))}
        </nav>
      </ScrollArea>
      <div className="p-3 border-t border-sidebar-border mt-auto">
         <Button
            variant="ghost"
            className="w-full justify-start text-sm font-normal text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
      </div>
    </div>
  );
}


export default function ShopManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();
  const isMobile = useIsMobile();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    if (!SHOP_MANAGER_EMAIL) {
        console.error("Shop Manager email not configured. Please set NEXT_PUBLIC_SHOP_MANAGER_EMAIL in .env.local");
        router.replace('/'); // Or an error page
        alert('Access Denied: Shop manager functionality is not configured.');
        return;
    }
    if (!loading) {
      if (!user) {
        router.replace('/login?redirect=/shop-manager/dashboard'); 
      } else if (user.email !== SHOP_MANAGER_EMAIL) {
        router.replace('/'); 
        alert('Access Denied: You do not have permission to view this page.');
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg text-foreground">Loading Shop Manager Area...</p>
      </div>
    );
  }

  if (!user || user.email !== SHOP_MANAGER_EMAIL) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <p className="text-lg text-destructive">Access Denied. Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-muted/40">
      {isMobile ? (
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent side="left" className="p-0 w-[280px] bg-sidebar border-r-0">
            <ShopManagerSidebarContent closeSheet={() => setIsSheetOpen(false)} />
          </SheetContent>
        </Sheet>
      ) : (
        <div className="hidden md:block w-64 fixed h-full">
           <ShopManagerSidebarContent />
        </div>
      )}
      
      <div className={`flex-1 ${!isMobile ? 'md:ml-64' : ''}`}>
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 sm:py-4 md:hidden">
          <SheetTrigger asChild>
            <Button size="icon" variant="outline" className="md:hidden" onClick={() => setIsSheetOpen(true)}>
              <MenuIcon className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <Link href="/shop-manager/dashboard" className="md:hidden">
            <Logo className="text-lg"/>
          </Link>
        </header>
        <main className="p-4 sm:p-6 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
