
"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Inbox, Loader2, RefreshCw } from 'lucide-react';
import { getUserMessages, type Message } from '@/services/messageService';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function InboxView({ userId, userEmail }: { userId: string | null, userEmail: string | null }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMessages = React.useCallback(async () => {
    if (userId) {
      setIsLoading(true);
      const userMessages = await getUserMessages(userId);
      setMessages(userMessages);
      setIsLoading(false);
    } else {
        setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);
  
  if (!userId) {
      return (
         <Card className="shadow-lg h-full flex flex-col min-h-[400px]">
            <CardHeader>
                <CardTitle className="text-xl font-headline flex items-center">
                    <Inbox className="mr-2 h-5 w-5 text-primary" /> My Inbox
                </CardTitle>
                <CardDescription>Please log in to view your messages.</CardDescription>
            </CardHeader>
             <CardContent className="flex-grow flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                    <p>Login required to access your inbox.</p>
                </div>
            </CardContent>
        </Card>
      );
  }

  return (
    <Card className="shadow-lg h-full flex flex-col min-h-[400px]">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl font-headline flex items-center">
            <Inbox className="mr-2 h-5 w-5 text-primary" /> My Inbox
          </CardTitle>
          <CardDescription>Messages from sellers and customer support.</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={fetchMessages} disabled={isLoading}>
          <RefreshCw className={cn("mr-2 h-4 w-4", isLoading && "animate-spin")} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent className="flex-grow">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-muted-foreground pt-10">
            <Inbox className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
            <p>Your inbox is empty.</p>
          </div>
        ) : (
          <Accordion type="single" collapsible className="w-full">
            {messages.map((message) => (
              <AccordionItem value={message.id} key={message.id}>
                <AccordionTrigger className="hover:no-underline hover:bg-muted/50 px-4 py-2 rounded-md">
                   <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-4 text-left">
                             {!message.isRead && <Badge className="h-2 w-2 p-0 rounded-full" />}
                            <div className={cn(!message.isRead && "font-bold")}>{message.from}</div>
                            <div className={cn("truncate", !message.isRead && "font-bold")}>{message.subject}</div>
                        </div>
                         <div className="text-xs text-muted-foreground font-normal pr-4">
                            {new Date(message.receivedAt).toLocaleDateString()}
                        </div>
                   </div>
                </AccordionTrigger>
                <AccordionContent className="p-4 text-sm text-muted-foreground bg-slate-50 dark:bg-slate-800/50 rounded-b-md">
                  {message.body}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
}
