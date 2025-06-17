
"use client"; // Make it a client component for form handling and useToast

import type { Metadata } from 'next'; // Metadata can't be used directly
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, MessageSquare, MapPin, Clock } from 'lucide-react'; // Replaced Phone with MessageSquare for WhatsApp, added Clock
import { useToast } from "@/hooks/use-toast";
import { useEffect } from 'react';

// Set title dynamically for client component
const PageTitle = 'Contact Us - Creme Lite';

export default function ContactPage() {
  const { toast } = useToast();

  useEffect(() => {
    document.title = PageTitle;
  }, []);


  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // In a real app, you would handle form submission here (e.g., send data to an API)
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
    // Optionally, reset the form
    event.currentTarget.reset();
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-primary mb-12 font-headline">Contact Us</h1>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-4 font-headline">Get in Touch</h2>
              <p className="text-muted-foreground">
                We'd love to hear from you! Whether you have a question about our products, an order, or anything else, our team is ready to answer all your questions.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center mt-1">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Email Us</h3>
                  <a href="mailto:support@cremecollections.shop" className="text-primary hover:underline block">support@cremecollections.shop</a>
                  <a href="mailto:creme.collectionlt@gmail.com" className="text-primary hover:underline block">creme.collectionlt@gmail.com</a>
                  <p className="text-sm text-muted-foreground">We typically respond within 24 hours.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center mt-1">
                  <MessageSquare className="w-5 h-5" /> {/* Changed from Phone to MessageSquare for WhatsApp */}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">WhatsApp Us</h3>
                  <a href="https://wa.me/254742468070" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline block">+254 742 468070</a>
                  <a href="https://wa.me/254743117211" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline block">+254 743 117211</a>
                  <a href="https://wa.me/254717988700" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline block">+254 717 988700</a>
                </div>
              </div>
               <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center mt-1">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Operating Hours (EAT)</h3>
                  <p className="text-muted-foreground">Mon – Fri: 9am – 5pm</p>
                  <p className="text-muted-foreground">Saturday: 9am – 12pm</p>
                  <p className="text-muted-foreground">Sunday & Public Holidays: Closed</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center mt-1">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Our Office</h3>
                  <p className="text-muted-foreground">123 Creme Lite St, Suite 100<br />Commerce City, EC 54321</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 sm:p-8 rounded-lg shadow-lg">
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
                <Textarea name="message" id="message" rows={4} required className="mt-1" />
              </div>
              <div>
                <Button type="submit" className="w-full">Send Message</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
