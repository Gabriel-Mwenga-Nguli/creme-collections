
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Mail, PartyPopper } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const NEWSLETTER_POPUP_KEY = 'cremeCollectionsNewsletterPopupShown';

export default function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const hasBeenShown = localStorage.getItem(NEWSLETTER_POPUP_KEY);
    const timer = setTimeout(() => {
      if (!hasBeenShown) {
        setIsOpen(true);
      }
    }, 5000); // Show popup after 5 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Subscribing email:", email);
    toast({
      title: "Subscribed Successfully!",
      description: "Thank you for joining our newsletter. Keep an eye out for exclusive deals!",
      action: <PartyPopper className="h-5 w-5 text-green-500" />,
    });
    setIsSubmitting(false);
    setIsOpen(false);
    localStorage.setItem(NEWSLETTER_POPUP_KEY, 'true');
  };

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem(NEWSLETTER_POPUP_KEY, 'true'); // Mark as shown even if closed without subscribing
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleClose(); }}>
      <DialogContent className="sm:max-w-[450px] bg-card shadow-2xl rounded-xl border-primary/30">
        <DialogHeader className="text-center items-center pt-2">
          <Mail className="h-12 w-12 text-primary mb-3" />
          <DialogTitle className="text-2xl font-bold text-primary font-headline">Stay in the Loop!</DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm mt-1 px-2">
            Get exclusive deals, new arrivals, and special offers delivered straight to your inbox.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubscribe} className="px-2 py-4 space-y-4">
          <Input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-11 text-base"
            aria-label="Email for newsletter"
          />
          <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Subscribe Now'}
          </Button>
        </form>
        <DialogFooter className="sm:justify-center px-2 pb-2">
           <Button variant="ghost" size="sm" onClick={handleClose} className="text-xs text-muted-foreground">No thanks</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// You might need a Loader2 icon component if it's not globally available
// For example, if not already defined in lucide-react or similar:
// const Loader2 = (props) => (
//   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
//     <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
//   </svg>
// );

    