
"use client"; 

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, Phone, MapPin, Clock } from 'lucide-react'; 
import { useToast } from "@/hooks/use-toast";
import { useEffect } from 'react';
import HelpSection from '@/components/features/contact/HelpSection'; // Import the new component

const PageTitle = 'Contact Us - Creme Collections';

export default function ContactPage() {
  const { toast } = useToast();

  useEffect(() => {
    document.title = PageTitle;
  }, []);


  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Form submitted with data:", {
        name: (event.currentTarget.elements.namedItem('name') as HTMLInputElement).value,
        email: (event.currentTarget.elements.namedItem('email') as HTMLInputElement).value,
        subject: (event.currentTarget.elements.namedItem('subject') as HTMLInputElement).value,
        message: (event.currentTarget.elements.namedItem('message') as HTMLInputElement).value,
    });
    
    toast({
      title: "Message Sent!",
      description: "Thank you for contacting us. We'll get back to you soon.",
      variant: "default",
    });
    event.currentTarget.reset();
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="max-w-6xl mx-auto"> {/* Increased max-width to accommodate layout */}
        <h1 className="text-4xl font-bold text-center text-primary mb-12 font-headline">Contact Creme Collections</h1>

        <div className="grid md:grid-cols-2 gap-10 md:gap-12 items-start">
          {/* Left Column: New Help Section */}
          <div className="space-y-8">
            <HelpSection />
            
            {/* Additional Contact Info / Store Details - Re-add if HelpSection doesn't cover everything */}
            <div className="mt-8 p-6 bg-card rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-foreground mb-4 font-headline flex items-center"><MapPin className="w-5 h-5 mr-2 text-primary" /> Our Office</h3>
              <address className="text-sm text-muted-foreground not-italic space-y-1">
                <p>Taveta Road, Nairobi, Kenya</p>
                <p className="mt-2">Email: <a href="mailto:support@cremecollections.shop" className="text-primary hover:underline">support@cremecollections.shop</a></p>
              </address>
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-foreground mb-2 font-headline flex items-center"><Clock className="w-5 h-5 mr-2 text-primary" /> Operating Hours (EAT)</h3>
                <p className="text-sm text-muted-foreground">Mon – Fri: 9am – 5pm</p>
                <p className="text-sm text-muted-foreground">Saturday: 9am – 12pm</p>
                <p className="text-sm text-muted-foreground">Sunday & Public Holidays: Closed</p>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 sm:p-8 rounded-lg shadow-xl">
              <h2 className="text-2xl font-semibold text-foreground mb-5 font-headline">Send Us a Message</h2>
              <div>
                <Label htmlFor="name" className="font-medium">Full Name</Label>
                <Input type="text" name="name" id="name" autoComplete="name" required className="mt-1" />
              </div>
              <div>
                <Label htmlFor="email" className="font-medium">Email Address</Label>
                <Input type="email" name="email" id="email" autoComplete="email" required className="mt-1" />
              </div>
              <div>
                <Label htmlFor="subject" className="font-medium">Subject</Label>
                <Input type="text" name="subject" id="subject" required className="mt-1" />
              </div>
              <div>
                <Label htmlFor="message" className="font-medium">Message</Label>
                <Textarea name="message" id="message" rows={5} required className="mt-1" />
              </div>
              <div>
                <Button type="submit" className="w-full" size="lg">Send Message</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
