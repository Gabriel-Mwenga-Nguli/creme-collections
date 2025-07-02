"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarMenuBadge, SidebarSeparator } from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LayoutDashboard, ShoppingBag, ListOrdered, Users, Settings, LogOut, BarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

export function AdminSidebarNav() {
  const pathname = usePathname();
  const { user, userProfile, logout } = useAuth();

  const isActive = (path: string) => {
    return pathname === path || (path !== '/admin' && pathname.startsWith(path));
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 flex-grow">
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/admin/dashboard" passHref legacyBehavior>
              <SidebarMenuButton isActive={isActive('/admin/dashboard')}>
                <LayoutDashboard />
                Dashboard
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarGroup>
            <SidebarGroupLabel>Management</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                    <Link href="/admin/products" passHref legacyBehavior>
                    <SidebarMenuButton isActive={isActive('/admin/products')}>
                        <ShoppingBag />
                        Products
                    </SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <Link href="/admin/orders" passHref legacyBehavior>
                    <SidebarMenuButton isActive={isActive('/admin/orders')}>
                        <ListOrdered />
                        Orders
                    </SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
                 <SidebarMenuItem>
                    <Link href="/admin/customers" passHref legacyBehavior>
                    <SidebarMenuButton isActive={isActive('/admin/customers')}>
                        <Users />
                        Customers
                    </SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarMenu>
      </div>

      <div className="p-4 mt-auto">
        <SidebarSeparator className="my-2" />
        <div className="flex items-center gap-3 p-2">
           <Avatar className="h-9 w-9">
             <AvatarImage src={userProfile?.photoURL || `https://i.pravatar.cc/150?u=${user?.email}`} alt={userProfile?.name} />
             <AvatarFallback>{userProfile?.name?.charAt(0) || 'A'}</AvatarFallback>
           </Avatar>
           <div className="overflow-hidden">
             <p className="text-sm font-medium truncate">{userProfile?.name || 'Admin'}</p>
             <p className="text-xs text-muted-foreground truncate">{user?.email || 'admin@example.com'}</p>
           </div>
        </div>
        <Button variant="ghost" className="w-full justify-start mt-2" onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </Button>
      </div>
    </div>
  );
}
