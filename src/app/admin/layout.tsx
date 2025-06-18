
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
import { Separator } from '@/components/ui/separator';
import { LayoutDashboard, ShoppingBag, ListOrdered, Users, MessageSquare, Settings, LogOut, Menu as MenuIcon, X, Loader2, BarChart3 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

interface AdminNavLink {
  href: string;
  label: string;
  icon: React.ElementType;
}

const ADMIN_NAV_LINKS: AdminNavLink[] = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: ShoppingBag },
  { href: '/admin/orders', label: 'Orders', icon: ListOrdered },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/chat', label: 'Support Chat', icon: MessageSquare },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

function AdminSidebarContent({ closeSheet }: { closeSheet?: () => void }) {
  const [user] = useAuthState(auth);
  const router = useRouter();

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/login');
    if (closeSheet) closeSheet();
  };
  
  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'AD';
    const nameParts = name.split(' ');
    if (nameParts.length > 1) return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      <div className="p-4 border-b border-sidebar-border">
        <Link href="/admin/dashboard" onClick={closeSheet}>
          <Logo className="text-xl text-primary"/>
        </Link>
         <p className="text-xs text-muted-foreground mt-1">Management Panel</p>
      </div>
      {user && (
        <div className="p-3 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'Admin'} />
              <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xs font-medium">{user.displayName || 'Admin User'}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </div>
      )}
      <ScrollArea className="flex-grow">
        <nav className="p-3 space-y-1">
          {ADMIN_NAV_LINKS.map((link) => (
            <Button
              key={link.label}
              variant="ghost"
              className="w-full justify-start text-sm font-normal text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              asChild
              onClick={closeSheet}
            >
              <Link href={link.href}>
                <span>
                  <link.icon className="mr-2 h-4 w-4 inline-block" />
                  {link.label}
                </span>
              </Link>
            </Button>
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


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();
  const isMobile = useIsMobile();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/login?redirect=/admin/dashboard'); // Redirect to login if not authenticated
      } else if (user.email !== ADMIN_EMAIL) {
        router.replace('/'); // Redirect to homepage if not admin
        alert('Access Denied: You do not have permission to view this page.');
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg text-foreground">Loading Admin Area...</p>
      </div>
    );
  }

  if (!user || user.email !== ADMIN_EMAIL) {
    // This state should ideally be brief due to the useEffect redirect,
    // but it's good to have a fallback UI.
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
            <AdminSidebarContent closeSheet={() => setIsSheetOpen(false)} />
          </SheetContent>
        </Sheet>
      ) : (
        <div className="hidden md:block w-64 fixed h-full">
           <AdminSidebarContent />
        </div>
      )}
      
      <div className={`flex-1 ${!isMobile ? 'md:ml-64' : ''}`}>
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 sm:py-4 md:hidden">
          <SheetTrigger asChild>
            <Button size="icon" variant="outline" className="md:hidden">
              <MenuIcon className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <Link href="/admin/dashboard" className="md:hidden">
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
