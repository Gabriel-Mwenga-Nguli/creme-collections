
import type { Metadata } from 'next';
import './globals.css'; // Moved to be one of the first imports

import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { CartProvider } from '@/context/CartContext';
import ChatWidget from '@/components/features/chat/ChatWidget'; // Import the ChatWidget

export const metadata: Metadata = {
  title: 'Creme Collections - Online Shopping Kenya | Best Deals & Quality Products',
  description: 'Creme Collections: Your top choice for online shopping in Kenya. Discover amazing deals on electronics, fashion, home goods, beauty, and more. Fast delivery, secure payments.',
  keywords: [
    'Creme Collections',
    'online shopping Kenya',
    'ecommerce Kenya',
    'buy online Kenya',
    'best online store Kenya',
    'Jumia Kenya alternative',
    'Kilimall Kenya alternative',
    'online marketplace Kenya',
    'shop Kenya online',
    'Nairobi online shopping',
    'Mombasa online shopping',
    'Kisumu online shopping',
    'Nakuru online shopping',
    'electronics Kenya',
    'smartphones Kenya',
    'laptops Kenya',
    'TVs Kenya',
    'home appliances Kenya',
    'fashion Kenya',
    'mens fashion Kenya',
    'womens fashion Kenya',
    'kids fashion Kenya',
    'shoes Kenya',
    'home goods Kenya',
    'furniture Kenya',
    'kitchen appliances Kenya',
    'decor Kenya',
    'beauty products Kenya',
    'skincare Kenya',
    'makeup Kenya',
    'sports equipment Kenya',
    'fitness gear Kenya',
    'toys Kenya',
    'baby products Kenya',
    'groceries online Kenya',
    'supermarket Kenya online',
    'deals Kenya',
    'discounts Kenya',
    'offers Kenya',
    'sales Kenya online',
    'Kenyan online retailers',
    'affordable online shopping Kenya',
    'quality products Kenya',
    'fast delivery Kenya',
    'secure online payment Kenya',
    'Mpesa shopping Kenya',
    'cash on delivery Kenya',
    'shop clothes online Kenya',
    'buy gadgets online Kenya',
    'computer accessories Kenya',
    'mobile accessories Kenya',
    'gaming consoles Kenya',
    'PS5 Kenya',
    'Xbox Kenya',
    'books online Kenya',
    'stationery Kenya',
    'office supplies Kenya',
    'health and wellness Kenya',
    'vitamins Kenya',
    'personal care Kenya',
    'Creme Lite',
    'Creme Collections online',
    'Kenya ecommerce platform',
    'best deals online Kenya',
    'daily deals Kenya',
    'shop electronics Nairobi',
    'shop fashion Nairobi',
    'online shopping Nairobi',
    'top online shops Kenya',
    'online shopping sites in Kenya'
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
          <CartProvider>
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
            <Toaster />
            <ChatWidget /> {/* Add ChatWidget here */}
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
