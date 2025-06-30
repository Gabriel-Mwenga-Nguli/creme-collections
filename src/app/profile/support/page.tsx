
"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Send, Bot, User as UserIcon, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { dashboardSupport, type DashboardSupportInput, type DashboardSupportOutput } from '@/ai/flows/dashboard-support-flow';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
}

export default function SupportPage() {
    const { user, isLoading: isAuthLoading } = useAuth();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = useCallback(() => {
        setTimeout(() => {
            if (scrollAreaRef.current) {
                const scrollableViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
                if (scrollableViewport) {
                    scrollableViewport.scrollTop = scrollableViewport.scrollHeight;
                }
            }
        }, 100);
    },[]);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);
    
    useEffect(() => {
        if (messages.length === 0) {
            setMessages([
              { id: 'welcome', role: 'model', content: 'Hello! I am your personal account assistant. How can I help you today? You can ask about your recent orders, profile information, or loyalty points.'}
            ]);
        }
    }, [messages.length]);


    const handleSendMessage = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const userMessageContent = inputValue.trim();
        if (!userMessageContent || !user) return;

        const newUserMessage: ChatMessage = { id: `${Date.now()}-user`, role: 'user', content: userMessageContent };
        setMessages(prev => [...prev, newUserMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const historyForFlow = messages.map(msg => ({ role: msg.role, content: msg.content }));
            const input: DashboardSupportInput = { userId: user.uid, message: userMessageContent, chatHistory: historyForFlow };
            const result: DashboardSupportOutput = await dashboardSupport(input);
            const aiResponse: ChatMessage = { id: `${Date.now()}-model`, role: 'model', content: result.response };
            setMessages(prev => [...prev, aiResponse]);
        } catch (error) {
            const errorMessage: ChatMessage = { id: `${Date.now()}-error`, role: 'model', content: "Sorry, I encountered an issue and can't respond right now. Please try again in a moment." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };
    
    if (isAuthLoading) {
        return (
            <Card className="shadow-lg h-full flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </Card>
        );
    }
    
    if (!user) {
         return (
             <Card className="shadow-lg h-full flex items-center justify-center min-h-[60vh]">
                <CardHeader className="text-center">
                    <CardTitle>Access Denied</CardTitle>
                    <CardDescription>Please log in to use the AI Support feature.</CardDescription>
                </CardHeader>
            </Card>
         );
    }

  return (
    <Card className="shadow-lg h-full flex flex-col min-h-[calc(100vh-20rem)]">
      <CardHeader>
          <CardTitle className="text-xl font-headline flex items-center">
            <Sparkles className="mr-3 h-6 w-6 text-primary" /> AI Account Assistant
          </CardTitle>
          <CardDescription>Your personal assistant for account and order inquiries.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow p-0 overflow-hidden flex flex-col">
         <ScrollArea className="h-full flex-grow p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex items-start gap-2.5 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {message.role === 'model' && <Bot className="h-6 w-6 text-muted-foreground self-start shrink-0 mt-1" />}
                  <div className={`max-w-[85%] rounded-lg px-3 py-2 text-sm shadow-sm ${message.role === 'user' ? 'bg-secondary text-secondary-foreground rounded-br-none' : 'bg-muted text-muted-foreground rounded-bl-none'}`}>
                    {message.content.split('\n').map((line, i, arr) => (
                      <span key={i}>{line}{i < arr.length - 1 && <br/>}</span>
                    ))}
                  </div>
                  {message.role === 'user' && <UserIcon className="h-6 w-6 text-muted-foreground self-start shrink-0 mt-1" />}
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start items-center gap-2.5">
                   <Bot className="h-6 w-6 text-muted-foreground self-start shrink-0 mt-1" />
                  <div className="bg-muted text-muted-foreground rounded-lg px-3 py-2 text-sm flex items-center shadow-sm rounded-bl-none">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" /> Thinking...
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
      </CardContent>
      <CardFooter className="p-4 border-t">
          <form onSubmit={handleSendMessage} className="flex w-full gap-2 items-center">
            <Input
              ref={inputRef}
              type="text"
              placeholder="Ask about your orders, profile, or points..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-grow h-10"
              disabled={isLoading}
              autoComplete="off"
            />
            <Button type="submit" size="icon" className="h-10 w-10 flex-shrink-0" disabled={isLoading || !inputValue.trim()}>
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              <span className="sr-only">Send message</span>
            </Button>
          </form>
      </CardFooter>
    </Card>
  );
}
