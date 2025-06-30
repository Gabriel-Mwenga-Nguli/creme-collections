
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PROFILE_NAV_LINKS } from '@/lib/constants';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2 } from 'lucide-react';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, userProfile, isLoading } = useAuth();
  
  const getInitials = (name: string | null | undefined) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 min-h-[50vh] flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-muted/30">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="bg-gradient-to-br from-primary via-primary/80 to-secondary p-6 rounded-2xl shadow-lg mb-8 text-primary-foreground dark:from-slate-800 dark:via-slate-800/80 dark:to-slate-900 dark:text-primary-foreground">
            <div className="flex flex-col sm:flex-row items-center gap-4">
                <Avatar className="h-20 w-20 md:h-24 md:w-24 border-4 border-primary-foreground/50">
                  <AvatarImage src={userProfile?.photoURL || undefined} alt={userProfile?.name} className="object-cover"/>
                  <AvatarFallback className="text-3xl bg-secondary text-secondary-foreground dark:bg-slate-700 dark:text-slate-200">
                    {getInitials(userProfile?.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center sm:text-left">
                    <h1 className="text-2xl md:text-3xl font-bold font-headline">{userProfile?.name}</h1>
                    <p className="text-md opacity-80">{userProfile?.email}</p>
                </div>
            </div>
        </div>

        <div className="grid md:grid-cols-4 gap-8 items-start">
          <aside className="md:col-span-1">
            <Card className="shadow-lg sticky top-24">
              <CardContent className="p-3">
                <nav className="flex flex-col space-y-1">
                  {PROFILE_NAV_LINKS.map((link) => (
                    <Button
                      key={link.href}
                      asChild
                      variant={pathname === link.href ? 'default' : 'ghost'}
                      className="justify-start text-base py-6"
                    >
                      <Link href={link.href}>
                        {link.icon && <link.icon className={cn("mr-3 h-5 w-5", pathname === link.href ? "" : "text-muted-foreground group-hover:text-primary")} />}
                        {link.label}
                      </Link>
                    </Button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </aside>
          <main className="md:col-span-3">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
