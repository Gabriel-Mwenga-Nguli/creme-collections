
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Percent, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

const OFFER_POPUP_KEY = 'cremeCollectionsOfferPopupShown_session';

const offers = [
  {
    title: 'Flash Sale Alert!',
    description: 'Get 15% off all electronics for the next 24 hours. Use code FLASH15 at checkout!',
    buttonText: 'Shop Electronics',
    href: '/products/category/electronics'
  },
  {
    title: 'Free Shipping Today!',
    description: 'Enjoy free shipping on all orders over KES 2,000. No code needed!',
    buttonText: 'Start Shopping',
    href: '/products'
  },
  {
    title: 'New Fashion In!',
    description: 'Explore the latest trends in our fashion collection and get 10% off your first apparel item.',
    buttonText: 'Explore Fashion',
    href: '/products/category/fashion'
  }
];

export default function ShopOfferPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(offers[0]);

  useEffect(() => {
    const hasBeenShown = sessionStorage.getItem(OFFER_POPUP_KEY);
    
    // Select a random offer
    const randomOffer = offers[Math.floor(Math.random() * offers.length)];
    setSelectedOffer(randomOffer);

    const timer = setTimeout(() => {
      if (!hasBeenShown) {
        setIsOpen(true);
        sessionStorage.setItem(OFFER_POPUP_KEY, 'true');
      }
    }, 8000); // Show popup after 8 seconds

    return () => clearTimeout(timer);
  }, []);


  const handleClose = () => {
    setIsOpen(false);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleClose(); }}>
      <DialogContent className="sm:max-w-md bg-card shadow-2xl rounded-xl border-primary/30">
        <DialogHeader className="text-center items-center pt-2">
          <Percent className="h-12 w-12 text-primary mb-3" />
          <DialogTitle className="text-2xl font-bold text-primary font-headline">{selectedOffer.title}</DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm mt-1 px-2">
            {selectedOffer.description}
          </DialogDescription>
        </DialogHeader>
        <div className="p-4 flex flex-col items-center">
          <Button asChild size="lg" className="w-full" onClick={handleClose}>
            <Link href={selectedOffer.href}>
                {selectedOffer.buttonText}
            </Link>
          </Button>
          <Button variant="ghost" size="sm" onClick={handleClose} className="text-xs text-muted-foreground mt-2">
            Maybe later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
