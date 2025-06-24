
"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { BotIcon as BotMessageSquareIconInChat, Send, X, Loader2, User as UserIcon, MessageSquare } from 'lucide-react';
import { comprehensiveChatSupport, type ComprehensiveChatSupportInput, type ComprehensiveChatSupportOutput } from '@/ai/flows/comprehensive-chat-support';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();

  const toggleChat = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const scrollToBottom = useCallback(() => {
    if (scrollAreaRef.current) {
      const scrollableViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (scrollableViewport) {
        scrollableViewport.scrollTop = scrollableViewport.scrollHeight;
      }
    }
  },[]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = useCallback(async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    const userMessageContent = inputValue.trim();
    if (!userMessageContent) return;

    const newUserMessage: ChatMessage = { id: `${Date.now()}-user`, role: 'user', content: userMessageContent };
    setMessages(prev => [...prev, newUserMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const historyForFlow = messages.map(msg => ({ role: msg.role, content: msg.content }));

      const input: ComprehensiveChatSupportInput = {
        message: userMessageContent,
        chatHistory: historyForFlow,
        isLoggedIn: false, // Hardcoded to false as auth is disabled
        userName: undefined,
      };
      const result: ComprehensiveChatSupportOutput = await comprehensiveChatSupport(input);
      
      const aiResponse: ChatMessage = { id: `${Date.now()}-model`, role: 'model', content: result.response };
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error("Chat API error:", error);
      const errorMessage: ChatMessage = { id: `${Date.now()}-error`, role: 'model', content: "Sorry, I'm having trouble connecting. Please try again later." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [inputValue, messages, toast]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage = "Hello! I'm CremeBot, your virtual assistant for Creme Collections. How can I assist you?";
      setMessages([{ id: 'welcome-msg', role: 'model', content: welcomeMessage }]);
    }
  }, [isOpen, messages.length]);


  return (
    <>
      <Button
        variant="default"
        size="lg"
        className="fixed bottom-6 right-6 rounded-full shadow-xl w-16 h-16 p-0 z-[60] flex items-center justify-center animate-bounce hover:animate-none"
        onClick={toggleChat}
        aria-label={isOpen ? "Close chat support" : "Open chat support"}
      >
        {isOpen ? <X className="h-7 w-7" /> : <MessageSquare className="h-7 w-7" />}
      </Button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-full max-w-sm h-auto max-h-[calc(100vh-12rem)] shadow-2xl z-[60] flex flex-col rounded-lg overflow-hidden animate-in fade-in-0 slide-in-from-bottom-5 duration-300">
          <Card className="w-full h-full flex flex-col bg-card border border-border">
            <CardHeader className="p-4 border-b flex-shrink-0">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <BotMessageSquareIconInChat className="h-6 w-6 text-primary" /> Creme Collections Support
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow p-0 overflow-hidden min-h-[200px]">
              <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-start gap-2.5 ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {message.role === 'model' && <BotMessageSquareIconInChat className="h-6 w-6 text-muted-foreground self-start shrink-0 mt-1" />}
                      <div
                        className={`max-w-[80%] rounded-lg px-3 py-2 text-sm shadow-sm ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground rounded-br-none'
                            : 'bg-muted text-muted-foreground rounded-bl-none'
                        }`}
                      >
                        {message.content.split('\n').map((line, i, arr) => (
                          <span key={i}>{line}{i < arr.length - 1 && <br/>}</span>
                        ))}
                      </div>
                      {message.role === 'user' && <UserIcon className="h-6 w-6 text-muted-foreground self-start shrink-0 mt-1" />}
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start items-center gap-2.5">
                       <BotMessageSquareIconInChat className="h-6 w-6 text-muted-foreground self-start shrink-0 mt-1" />
                      <div className="bg-muted text-muted-foreground rounded-lg px-3 py-2 text-sm flex items-center shadow-sm rounded-bl-none">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" /> Typing...
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter className="p-3 border-t flex-shrink-0">
              <form onSubmit={handleSendMessage} className="flex w-full gap-2 items-center">
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder="Ask CremeBot..."
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
        </div>
      )}
    </>
  );
}
