"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarContent, SidebarHeader, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebarNav } from "@/components/admin/AdminSidebar";
import Logo from "@/components/logo";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import { ADMIN_EMAIL } from "@/lib/constants";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isAdmin = user?.email === ADMIN_EMAIL;

  React.useEffect(() => {
    if (!isLoading) {
      if (!user && pathname !== '/admin/login') {
        router.replace('/admin/login');
      } else if (user && !isAdmin) {
        router.replace('/'); 
      }
    }
  }, [user, isAdmin, isLoading, pathname, router]);

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
                    <CardDescription>You do not have permission to view this page. Redirecting...</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild><a href="/">Go to Homepage</a></Button>
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
