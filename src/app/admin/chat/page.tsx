
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, MessageSquare, Send, Users, BotIcon as BotMessageSquareIcon, User as UserMessageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { draftSupportMessage, type DraftSupportMessageInput } from '@/ai/flows/draft-support-message-flow';
// Placeholder: In a real system, you would import functions to fetch conversations and messages
// import { getAdminConversations, getMessagesForConversation, sendAdminReply, type AdminConversation, type AdminMessage } from '@/services/adminChatService';

// Placeholder types - replace with actual types from your service if implemented
interface AdminConversation {
  id: string; // Represents the unique ID for a conversation (could be user ID or a dedicated conversation ID)
  userName: string; // Name of the user in the conversation
  userEmail?: string; // Email of the user
  lastMessageSnippet: string;
  lastMessageAt: Date;
  unreadCount?: number;
  // Add other relevant fields like profile picture URL if available
}

interface AdminMessage {
  id: string;
  sender: 'user' | 'admin' | 'bot'; // 'bot' could be for initial AI responses to user
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
  
  const [isFetchingConversations, setIsFetchingConversations] = useState(false);
  const [isFetchingMessages, setIsFetchingMessages] = useState(false);
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [isDrafting, setIsDrafting] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = "Support Chat - Admin";
    setIsFetchingConversations(true);
    setTimeout(() => {
      setConversations([
        { id: 'user123_convo', userName: 'Alice Wonder', userEmail: 'alice@example.com', lastMessageSnippet: 'My order is late and I need help tracking it please.', lastMessageAt: new Date(Date.now() - 3600000), unreadCount: 2 },
        { id: 'user456_convo', userName: 'Bob The Builder', userEmail: 'bob@example.com', lastMessageSnippet: 'Can I return this item? It does not fit as expected.', lastMessageAt: new Date(Date.now() - 86400000), unreadCount: 0 },
        { id: 'user789_convo', userName: 'Carol Danvers', userEmail: 'carol@example.com', lastMessageSnippet: 'Inquiry about bulk purchase discounts for my company.', lastMessageAt: new Date(Date.now() - 172800000), unreadCount: 1 },
        { id: 'userABC_convo', userName: 'David Copperfield', userEmail: 'david@example.com', lastMessageSnippet: 'What are your international shipping options?', lastMessageAt: new Date(Date.now() - 2 * 86400000), unreadCount: 0 },
        { id: 'userXYZ_convo', userName: 'Eve Adams', userEmail: 'eve@example.com', lastMessageSnippet: 'I have a question about product XYZ specifications.', lastMessageAt: new Date(Date.now() - 5 * 3600000), unreadCount: 5 },
      ].sort((a, b) => b.lastMessageAt.getTime() - a.lastMessageAt.getTime()));
      setIsFetchingConversations(false);
    }, 1000);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSelectConversation = (conversation: AdminConversation) => {
    setSelectedConversation(conversation);
    setIsFetchingMessages(true);
    setReplyText('');
    setAiTopic('');
    
    setTimeout(() => {
      const sampleMessages: AdminMessage[] = [];
      const baseTime = conversation.lastMessageAt;

      switch (conversation.id) {
        case 'user123_convo':
          sampleMessages.push({ id: 'msg1', sender: 'user', content: conversation.lastMessageSnippet, timestamp: baseTime });
          sampleMessages.push({ id: 'msg2', sender: 'admin', content: 'Hi Alice, I can help with that. Could you provide your order number?', timestamp: new Date(baseTime.getTime() + 60000) });
          sampleMessages.push({ id: 'msg3', sender: 'user', content: 'Yes, it is ORD-987654. I placed it last week.', timestamp: new Date(baseTime.getTime() + 120000) });
          break;
        case 'user456_convo':
          sampleMessages.push({ id: 'msg4', sender: 'user', content: conversation.lastMessageSnippet, timestamp: baseTime });
          sampleMessages.push({ id: 'msg5', sender: 'admin', content: 'Hello Bob, please tell me more about the item you wish to return and your order ID.', timestamp: new Date(baseTime.getTime() + 70000) });
          break;
        case 'user789_convo':
          sampleMessages.push({ id: 'msg6', sender: 'user', content: conversation.lastMessageSnippet, timestamp: baseTime });
          break;
        case 'userABC_convo':
          sampleMessages.push({ id: 'msg7', sender: 'user', content: conversation.lastMessageSnippet, timestamp: baseTime });
          sampleMessages.push({ id: 'msg8', sender: 'admin', content: 'Hello David, currently we primarily ship within Kenya. Could you let me know the destination country?', timestamp: new Date(baseTime.getTime() + 90000) });
          sampleMessages.push({ id: 'msg9', sender: 'user', content: 'I was hoping to ship to Uganda.', timestamp: new Date(baseTime.getTime() + 150000) });
          break;
        case 'userXYZ_convo':
           sampleMessages.push({ id: 'msg10', sender: 'user', content: "I'm interested in the 'Wireless Pro Headphones'.", timestamp: new Date(baseTime.getTime() - 300000) });
           sampleMessages.push({ id: 'msg11', sender: 'user', content: "Could you tell me about the battery life and noise cancellation features?", timestamp: baseTime });
          break;
        default:
          sampleMessages.push({ id: `default-${Date.now()}`, sender: 'user', content: conversation.lastMessageSnippet, timestamp: baseTime });
      }
      setMessages(sampleMessages.sort((a,b) => a.timestamp.getTime() - b.timestamp.getTime()));
      setIsFetchingMessages(false);
    }, 500);
  };

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedConversation) return;
    setIsSendingReply(true);
    
    const newMessage: AdminMessage = {
      id: `admin-${Date.now()}`,
      sender: 'admin',
      content: replyText,
      timestamp: new Date()
    };
    
    console.log("Sending reply:", replyText, "to conversation:", selectedConversation.id);
    
    setTimeout(() => {
      setMessages(prev => [...prev, newMessage]);
      setReplyText('');
      toast({ title: "Reply Sent (Simulated)" });
      setIsSendingReply(false);

      setConversations(prevConvos => 
        prevConvos.map(c => 
          c.id === selectedConversation.id 
            ? {...c, lastMessageSnippet: `Admin: ${newMessage.content.substring(0,30)}...`, lastMessageAt: new Date(), unreadCount: 0 } 
            : c
        ).sort((a, b) => b.lastMessageAt.getTime() - a.lastMessageAt.getTime())
      );
    }, 1000);
  };

  const handleGetAIDraft = async () => {
    let topicForAI = aiTopic.trim();
    if (!topicForAI && selectedConversation && messages.length > 0) {
      const lastUserMessage = [...messages].reverse().find(m => m.sender === 'user');
      if (lastUserMessage) {
        topicForAI = `Respond to user "${selectedConversation.userName}" (email: ${selectedConversation.userEmail || 'N/A'}) about their message: "${lastUserMessage.content.substring(0, 100)}..."`;
      }
    }

    if (!topicForAI) {
        toast({title: "AI Topic Missing", description: "Please provide a topic for the AI to draft a reply, or ensure there's a user message to respond to.", variant: "destructive"});
        return;
    }
    setIsDrafting(true);
    try {
        const input: DraftSupportMessageInput = { topic: topicForAI, userEmail: selectedConversation?.userEmail };
        const draft = await draftSupportMessage(input);
        setReplyText(draft.draftMessage);
        toast({title: "AI Draft Generated", description: "Review and edit the draft reply."});
    } catch (error) {
        toast({title: "AI Draft Error", description: "Could not generate AI draft.", variant: "destructive"});
        console.error("AI Draft error:", error);
    } finally {
        setIsDrafting(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-6 h-[calc(100vh-120px)] md:h-[calc(100vh-100px)]">
      {/* Conversations List */}
      <Card className="w-full md:w-1/3 lg:w-1/4 flex flex-col">
        <CardHeader className="pb-2 md:pb-3 border-b">
          <CardTitle className="text-base md:text-lg flex items-center gap-2">
            <Users className="h-4 w-4 md:h-5 md:w-5 text-primary"/>Conversations
          </CardTitle>
          <CardDescription className="text-xs md:text-sm">Select a conversation to view.</CardDescription>
        </CardHeader>
        <CardContent className="p-0 flex-grow overflow-hidden">
          {isFetchingConversations ? (
            <div className="flex items-center justify-center h-full p-4"><Loader2 className="h-6 w-6 md:h-8 md:w-8 animate-spin text-primary" /></div>
          ) : conversations.length > 0 ? (
            <ScrollArea className="h-full">
              <div className="p-2 md:p-3 space-y-1">
              {conversations.map(convo => (
                <Button
                  key={convo.id}
                  variant={selectedConversation?.id === convo.id ? 'secondary' : 'ghost'}
                  className="w-full h-auto justify-start text-left p-2 hover:bg-primary/10 focus-visible:bg-primary/10"
                  onClick={() => handleSelectConversation(convo)}
                >
                  <div className="w-full">
                    <div className="font-medium text-xs md:text-sm flex justify-between items-center">
                        <span className="truncate max-w-[calc(100%-30px)]">{convo.userName}</span>
                        {convo.unreadCount && convo.unreadCount > 0 && (
                            <span className="ml-1 text-xs bg-primary text-primary-foreground rounded-full px-1.5 py-0.5 shrink-0">{convo.unreadCount}</span>
                        )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{convo.lastMessageSnippet}</p>
                    <p className="text-xs text-muted-foreground/70 mt-0.5">{convo.lastMessageAt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {convo.lastMessageAt.toLocaleDateString([], {month: 'short', day: 'numeric'})}</p>
                  </div>
                </Button>
              ))}
              </div>
            </ScrollArea>
          ) : (
            <p className="p-4 text-xs md:text-sm text-muted-foreground text-center">No active conversations.</p>
          )}
        </CardContent>
      </Card>

      {/* Message View & Reply Area */}
      <Card className="w-full md:w-2/3 lg:w-3/4 flex flex-col">
        {selectedConversation ? (
          <>
            <CardHeader className="pb-2 md:pb-3 border-b">
              <CardTitle className="text-base md:text-lg">Chat with {selectedConversation.userName}</CardTitle>
              {selectedConversation.userEmail && <CardDescription className="text-xs md:text-sm">{selectedConversation.userEmail}</CardDescription>}
            </CardHeader>
            <CardContent className="p-0 flex-grow overflow-hidden min-h-[200px]">
              {isFetchingMessages ? (
                <div className="flex items-center justify-center h-full p-4"><Loader2 className="h-6 w-6 md:h-8 md:w-8 animate-spin text-primary" /></div>
              ) : (
                <ScrollArea className="h-full p-3 md:p-4">
                  <div className="space-y-3 md:space-y-4">
                    {messages.map(msg => (
                      <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.sender !== 'user' && <BotMessageSquareIcon className="h-5 w-5 md:h-6 md:w-6 text-muted-foreground shrink-0 mb-1" />}
                        <div className={`max-w-[75%] p-2 md:p-2.5 rounded-lg text-xs md:text-sm shadow-sm ${msg.sender === 'user' ? 'bg-muted text-muted-foreground rounded-br-none' : msg.sender === 'admin' ? 'bg-primary text-primary-foreground rounded-bl-none' : 'bg-secondary text-secondary-foreground rounded-bl-none'}`}>
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                          <p className={`text-xs mt-1 ${msg.sender !== 'user' ? 'text-primary-foreground/70 text-right' : 'text-muted-foreground/70 text-left'}`}>{msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                        </div>
                        {msg.sender === 'user' && <UserMessageIcon className="h-5 w-5 md:h-6 md:w-6 text-muted-foreground shrink-0 mb-1" />}
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
              )}
            </CardContent>
            <CardFooter className="p-2 md:p-3 border-t space-y-2 flex-col items-stretch">
                <div>
                    <Label htmlFor="aiTopic" className="text-xs text-muted-foreground">Topic for AI Draft (optional, or let AI infer from last message)</Label>
                    <Input id="aiTopic" value={aiTopic} onChange={e => setAiTopic(e.target.value)} placeholder="e.g., inquiry about order #123 refund" className="h-8 text-xs md:text-sm" />
                </div>
              <Textarea
                placeholder="Type your reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={2}
                className="text-xs md:text-sm min-h-[50px]"
              />
              <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
                <Button onClick={handleGetAIDraft} variant="outline" size="sm" disabled={isDrafting} className="w-full sm:w-auto text-xs md:text-sm">
                    {isDrafting ? <Loader2 className="mr-1.5 h-3.5 w-3.5 md:h-4 md:w-4 animate-spin"/> : <BotMessageSquareIcon className="mr-1.5 h-3.5 w-3.5 md:h-4 md:w-4"/>}
                    AI Draft Reply
                </Button>
                <Button onClick={handleSendReply} disabled={isSendingReply || !replyText.trim()} className="w-full sm:w-auto text-xs md:text-sm">
                  {isSendingReply && <Loader2 className="mr-1.5 h-3.5 w-3.5 md:h-4 md:w-4 animate-spin" />}
                  <Send className="mr-1.5 h-3.5 w-3.5 md:h-4 md:w-4" /> Send Reply
                </Button>
              </div>
            </CardFooter>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4 md:p-6">
            <MessageSquare className="h-12 w-12 md:h-16 md:w-16 mb-3 md:mb-4" />
            <p className="text-sm md:text-lg">Select a conversation to start chatting.</p>
            <p className="text-xs md:text-sm mt-1">This interface shows placeholder conversations.</p>
          </div>
        )}
      </Card>
    </div>
  );
}


    