
import type { Metadata } from 'next';
import './globals.css';

import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { AdminAuthProvider } from '@/context/AdminAuthContext';
import ChatWidget from '@/components/features/chat/ChatWidget';
import ShopOfferPopup from '@/components/features/home/ShopOfferPopup';
import Preloader from '@/components/layout/Preloader';


export const metadata: Metadata = {
  title: 'Creme Collections - Online Shopping Kenya | Best Deals & Quality Products',
  description: 'Creme Collections: Your top choice for online shopping in Kenya. Discover amazing deals on electronics, fashion, home goods, beauty, and more. Fast delivery, secure payments.',
  keywords: [
    'Creme Collections', 'online shopping Kenya', 'ecommerce Kenya', 'buy online Kenya',
    'best online store Kenya', 'Jumia Kenya alternative', 'Kilimall Kenya alternative',
    'Nairobi online shopping', 'electronics Kenya', 'fashion Kenya', 'home goods Kenya'
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/images/logo/logo.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Preloader />
          <AdminAuthProvider>
            <AuthProvider>
              <CartProvider>
                <Header />
                <main className="flex-grow">{children}</main>
                <Footer />
                <Toaster />
                <ChatWidget />
                <ShopOfferPopup />
              </CartProvider>
            </AuthProvider>
          </AdminAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
