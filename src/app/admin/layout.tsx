
"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarContent, SidebarHeader, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebarNav } from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import Logo from "@/components/logo";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { Loader2 } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAdmin, isLoading, user } = useAdminAuth();
  const pathname = usePathname();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && !isAdmin && pathname !== '/admin/login') {
      router.replace('/admin/login');
    }
  }, [isAdmin, isLoading, pathname, router]);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Redirect is handled by useEffect
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center justify-between p-2">
            <Logo />
            <SidebarTrigger className="md:hidden" />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <AdminSidebarNav user={user} />
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <main className="p-4 sm:p-6 lg:p-8">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
