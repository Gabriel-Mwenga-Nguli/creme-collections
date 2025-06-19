
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Phone } from 'lucide-react';

export default function HelpSection() {
  return (
    <Card className="bg-primary/5 border-primary/20 shadow-lg">
      <CardContent className="p-6 md:p-8">
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">
          <div className="space-y-4 md:space-y-5">
            <h2 className="text-3xl md:text-4xl font-bold text-primary font-headline tracking-tight">NEED HELP?</h2>
            <p className="text-muted-foreground text-sm md:text-base">
              If you have inquiries or need assistance, do not hesitate to chat with us. We are
              available Monday to Sunday (8am to 7pm). Public Holidays between 9am and 5pm.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
              <Button size="lg" className="w-full sm:w-auto" asChild>
                <Link href="/chat-support">
                  <MessageSquare className="mr-2 h-5 w-5" /> CHAT WITH US
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-primary text-primary hover:bg-primary/10 hover:text-primary" asChild>
                <a href="tel:+2542018881106"> {/* Use a generic number or one from constants */}
                  <Phone className="mr-2 h-5 w-5" /> CALL US
                </a>
              </Button>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground pt-2">
              You can also reach us on <a href="tel:+2542018881106" className="text-primary hover:underline font-medium">02018881106</a> from Monday to Friday (8 am to 5 pm).
              Public Holidays between 9 am and 5 pm.
            </p>
             <p className="text-xs md:text-sm text-muted-foreground">
              Alternative Numbers: <a href="tel:+254742468070" className="text-primary hover:underline font-medium">+254 742 468070</a>, <a href="tel:+254743117211" className="text-primary hover:underline font-medium">+254 743 117211</a>, <a href="tel:+254717988700" className="text-primary hover:underline font-medium">+254 717 988700</a>.
            </p>
          </div>
          <div className="hidden md:flex justify-center items-center">
            <Image
              src="/images/banners/beauty.png"
              alt="Customer Support"
              width={300}
              height={338}
              className="rounded-lg object-cover shadow-md"
              data-ai-hint="customer support helpdesk"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
