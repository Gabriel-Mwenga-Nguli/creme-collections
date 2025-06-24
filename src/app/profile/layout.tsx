
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PROFILE_NAV_LINKS } from '@/lib/constants';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
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
                    className="justify-start"
                  >
                    <Link href={link.href}>
                      {link.icon && <link.icon className={cn("mr-2 h-4 w-4", pathname === link.href ? "" : "text-muted-foreground")} />}
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
  );
}
