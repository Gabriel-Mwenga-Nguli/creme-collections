
"use client";

import Link from 'next/link';
import { CATEGORY_NAV_LINKS, type NavLink } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Menu } from 'lucide-react';

export default function CategoryDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="text-sm font-medium text-foreground hover:bg-accent/50 hover:text-primary px-3 py-2">
          <Menu className="mr-2 h-5 w-5" />
          Shop by Category
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="start">
        <DropdownMenuLabel>Browse Categories</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {CATEGORY_NAV_LINKS.map((category) =>
          category.subLinks && category.subLinks.length > 0 ? (
            <DropdownMenuSub key={category.label}>
              <DropdownMenuSubTrigger>
                {category.icon && <category.icon className="mr-2 h-4 w-4 text-muted-foreground" />}
                <span>{category.label}</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href={category.href} className="font-medium">All {category.label}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {category.subLinks.map((subLink) => (
                    <DropdownMenuItem key={subLink.label} asChild>
                      <Link href={subLink.href}>
                        {subLink.icon && <subLink.icon className="mr-2 h-4 w-4 text-muted-foreground" />}
                        {subLink.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          ) : (
            <DropdownMenuItem key={category.label} asChild>
              <Link href={category.href}>
                {category.icon && <category.icon className="mr-2 h-4 w-4 text-muted-foreground" />}
                {category.label}
              </Link>
            </DropdownMenuItem>
          )
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
