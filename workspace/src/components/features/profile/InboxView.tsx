
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Inbox } from 'lucide-react';

export default function InboxView({ userId, userEmail }: { userId: string | null, userEmail: string | null }) {
  return (
    <Card className="shadow-lg h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl font-headline flex items-center">
          <Inbox className="mr-2 h-5 w-5 text-primary" /> My Inbox
        </CardTitle>
        <CardDescription>This feature is temporarily disabled.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <p>The inbox is currently unavailable as backend services are offline.</p>
        </div>
      </CardContent>
    </Card>
  );
}
