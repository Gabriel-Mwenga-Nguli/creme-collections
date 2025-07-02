
"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarContent, SidebarHeader, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebarNav } from "@/components/admin/AdminSidebar";
import Logo from "@/components/logo";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  
  React.useEffect(() => {
    if (!isLoading) {
      if (!user && pathname !== '/admin/login') {
        router.replace('/admin/login');
      } else if (user && !isAdmin && pathname !== '/admin/login') {
        toast({
            title: 'Access Denied',
            description: 'You do not have administrative privileges.',
            variant: 'destructive',
        });
        router.replace('/'); 
      }
    }
  }, [user, isAdmin, isLoading, pathname, router, toast]);

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

  if (!user || !isAdmin) {
    return (
        <div className="flex items-center justify-center h-screen bg-muted">
            <Card className="max-w-md text-center">
                <CardHeader>
                    <CardTitle>Access Denied</CardTitle>
                    <CardDescription>Redirecting...</CardDescription>
                </CardHeader>
                <CardContent>
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </CardContent>
            </Card>
        </div>
    );
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
          <AdminSidebarNav />
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
