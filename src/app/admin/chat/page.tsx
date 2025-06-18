
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, MessageSquare, Send, Users, BotIcon as BotMessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
// Placeholder for actual chat data fetching and sending
// import { getAdminConversations, sendAdminReply, type AdminConversation, type AdminMessage } from '@/services/adminChatService';
import { draftSupportMessage, type DraftSupportMessageInput } from '@/ai/flows/draft-support-message-flow';

// Placeholder types until actual service is implemented
interface AdminConversation {
    id: string; // User ID or conversation ID
    userName: string;
    userEmail: string;
    lastMessageSnippet: string;
    lastMessageAt: Date;
    unreadCount?: number;
}
interface AdminMessage {
    id: string;
    sender: 'user' | 'admin';
    content: string;
    timestamp: Date;
}

export default function AdminChatPage() {
  const { toast } = useToast();
  const [conversations, setConversations] = useState<AdminConversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<AdminConversation | null>(null);
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [replyText, setReplyText] = useState('');
  const [aiTopic, setAiTopic] = useState('');
  const [isFetchingConversations, setIsFetchingConversations] = useState(true);
  const [isFetchingMessages, setIsFetchingMessages] = useState(false);
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [isDrafting, setIsDrafting] = useState(false);

  useEffect(() => {
    document.title = "Support Chat - Admin";
    // Placeholder: Fetch conversations
    setIsFetchingConversations(true);
    setTimeout(() => {
      setConversations([
        { id: 'user123', userName: 'Alice Wonder', userEmail: 'alice@example.com', lastMessageSnippet: 'My order is late...', lastMessageAt: new Date(Date.now() - 3600000), unreadCount: 2 },
        { id: 'user456', userName: 'Bob The Builder', userEmail: 'bob@example.com', lastMessageSnippet: 'Can I return this item?', lastMessageAt: new Date(Date.now() - 86400000) },
      ]);
      setIsFetchingConversations(false);
    }, 1000);
  }, []);

  const handleSelectConversation = (conversation: AdminConversation) => {
    setSelectedConversation(conversation);
    setIsFetchingMessages(true);
    // Placeholder: Fetch messages for selected conversation
    setTimeout(() => {
      setMessages([
        { id: 'msg1', sender: 'user', content: conversation.lastMessageSnippet, timestamp: conversation.lastMessageAt },
        { id: 'msg2', sender: 'admin', content: 'Let me check that for you.', timestamp: new Date(conversation.lastMessageAt.getTime() + 60000) },
      ]);
      setIsFetchingMessages(false);
    }, 500);
    setReplyText('');
    setAiTopic('');
  };

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedConversation) return;
    setIsSendingReply(true);
    // Placeholder: Send reply
    console.log("Sending reply:", replyText, "to:", selectedConversation.id);
    setTimeout(() => {
      setMessages(prev => [...prev, { id: `admin-${Date.now()}`, sender: 'admin', content: replyText, timestamp: new Date() }]);
      setReplyText('');
      toast({ title: "Reply Sent" });
      setIsSendingReply(false);
    }, 1000);
  };

  const handleGetAIDraft = async () => {
    if (!aiTopic.trim() && selectedConversation) {
      setAiTopic(`Responding to ${selectedConversation.userName} about "${messages[messages.length-1]?.content.substring(0,30)}..."`);
    }
    if (!aiTopic.trim()) {
        toast({title: "AI Topic Missing", description: "Please provide a topic for the AI to draft a reply.", variant: "destructive"});
        return;
    }
    setIsDrafting(true);
    try {
        const input: DraftSupportMessageInput = { topic: aiTopic, userEmail: selectedConversation?.userEmail };
        const draft = await draftSupportMessage(input);
        setReplyText(draft.draftMessage);
        toast({title: "AI Draft Generated", description: "Review and edit the draft reply."});
    } catch (error) {
        toast({title: "AI Draft Error", description: "Could not generate AI draft.", variant: "destructive"});
    } finally {
        setIsDrafting(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-120px)] md:h-[calc(100vh-100px)]">
      {/* Conversations List */}
      <Card className="w-full md:w-1/3 lg:w-1/4 flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2"><Users className="h-5 w-5 text-primary"/>Conversations</CardTitle>
          <CardDescription>Select a conversation to view messages.</CardDescription>
        </CardHeader>
        <CardContent className="p-0 flex-grow overflow-hidden">
          {isFetchingConversations ? (
            <div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : conversations.length > 0 ? (
            <ScrollArea className="h-full">
              <div className="p-3 space-y-1">
              {conversations.map(convo => (
                <Button
                  key={convo.id}
                  variant={selectedConversation?.id === convo.id ? 'secondary' : 'ghost'}
                  className="w-full h-auto justify-start text-left p-2"
                  onClick={() => handleSelectConversation(convo)}
                >
                  <div>
                    <div className="font-medium text-sm flex justify-between items-center">
                        {convo.userName}
                        {convo.unreadCount && convo.unreadCount > 0 && (
                            <span className="ml-2 text-xs bg-primary text-primary-foreground rounded-full px-1.5 py-0.5">{convo.unreadCount}</span>
                        )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{convo.lastMessageSnippet}</p>
                    <p className="text-xs text-muted-foreground/70 mt-0.5">{convo.lastMessageAt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                  </div>
                </Button>
              ))}
              </div>
            </ScrollArea>
          ) : (
            <p className="p-4 text-sm text-muted-foreground text-center">No active conversations.</p>
          )}
        </CardContent>
      </Card>

      {/* Message View & Reply Area */}
      <Card className="w-full md:w-2/3 lg:w-3/4 flex flex-col">
        {selectedConversation ? (
          <>
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-lg">Chat with {selectedConversation.userName}</CardTitle>
              <CardDescription>{selectedConversation.userEmail}</CardDescription>
            </CardHeader>
            <CardContent className="p-0 flex-grow overflow-hidden">
              {isFetchingMessages ? (
                <div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
              ) : (
                <ScrollArea className="h-full p-4">
                  <div className="space-y-4">
                    {messages.map(msg => (
                      <div key={msg.id} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] p-2.5 rounded-lg text-sm ${msg.sender === 'admin' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-muted rounded-bl-none'}`}>
                          <p>{msg.content}</p>
                          <p className={`text-xs mt-1 ${msg.sender === 'admin' ? 'text-primary-foreground/70 text-right' : 'text-muted-foreground/70 text-left'}`}>{msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
            <CardContent className="p-3 border-t space-y-2">
                <div>
                    <Label htmlFor="aiTopic" className="text-xs">Topic for AI Draft (optional)</Label>
                    <Input id="aiTopic" value={aiTopic} onChange={e => setAiTopic(e.target.value)} placeholder="e.g., inquiry about order #123 refund" className="h-8 text-sm" />
                </div>
              <Textarea
                placeholder="Type your reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={3}
                className="text-sm"
              />
              <div className="flex justify-between items-center">
                <Button onClick={handleGetAIDraft} variant="outline" size="sm" disabled={isDrafting || !aiTopic.trim()}>
                    {isDrafting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <BotMessageSquare className="mr-2 h-4 w-4"/>}
                    AI Draft Reply
                </Button>
                <Button onClick={handleSendReply} disabled={isSendingReply || !replyText.trim()}>
                  {isSendingReply && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Send className="mr-2 h-4 w-4" /> Send Reply
                </Button>
              </div>
            </CardContent>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-6">
            <MessageSquare className="h-16 w-16 mb-4" />
            <p className="text-lg">Select a conversation to start chatting.</p>
            <p className="text-sm">This is a placeholder chat interface.</p>
          </div>
        )}
      </Card>
    </div>
  );
}
