"use client";

import { useState, useEffect, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Send, Edit2, Inbox, Mail, MessageSquare } from 'lucide-react';
import { draftSupportMessage, type DraftSupportMessageInput, type DraftSupportMessageOutput } from '@/ai/flows/draft-support-message-flow';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp, Timestamp } from 'firebase/firestore';
import { format } from 'date-fns';

interface InboxViewProps {
  userId: string | null;
  userEmail: string | null;
}

interface Message {
  id: string;
  subject: string;
  body: string;
  recipientId: string;
  timestamp: Timestamp;
  direction: 'outgoing' | 'incoming';
}

export default function InboxView({ userId, userEmail }: InboxViewProps) {
  const { toast } = useToast();
  const [composeSubject, setComposeSubject] = useState('');
  const [composeTopic, setComposeTopic] = useState('');
  const [composeBody, setComposeBody] = useState('');
  const [isDrafting, setIsDrafting] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sentMessages, setSentMessages] = useState<Message[]>([]);
  const [isLoadingSent, setIsLoadingSent] = useState(true);
  const [activeTab, setActiveTab] = useState("compose");

  useEffect(() => {
    if (activeTab === "sent" && userId && db) {
      setIsLoadingSent(true);
      const messagesRef = collection(db, 'users', userId, 'messages');
      const q = query(messagesRef, where('direction', '==', 'outgoing'), orderBy('timestamp', 'desc'));

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const fetchedMessages: Message[] = [];
        querySnapshot.forEach((doc) => {
          fetchedMessages.push({ id: doc.id, ...doc.data() } as Message);
        });
        setSentMessages(fetchedMessages);
        setIsLoadingSent(false);
      }, (error) => {
        console.error("Error fetching sent messages:", error);
        toast({ title: "Error", description: "Could not fetch sent messages.", variant: "destructive" });
        setIsLoadingSent(false);
      });

      return () => unsubscribe();
    } else if (activeTab === "sent" && !db) {
        console.error("Firestore (db) is not initialized. Cannot fetch sent messages.");
        toast({ title: "Error", description: "Database not available. Cannot fetch sent messages.", variant: "destructive" });
        setIsLoadingSent(false);
    }
  }, [activeTab, userId, toast]);

  const handleGetAIDraft = async () => {
    if (!composeTopic.trim()) {
      toast({ title: "Topic Required", description: "Please enter a topic for the AI to draft a message.", variant: "destructive" });
      return;
    }
    setIsDrafting(true);
    try {
      const input: DraftSupportMessageInput = { topic: composeTopic, userEmail: userEmail || undefined };
      const result: DraftSupportMessageOutput = await draftSupportMessage(input);
      setComposeBody(result.draftMessage);
      if (!composeSubject && result.suggestedSubject) {
        setComposeSubject(result.suggestedSubject);
      }
      toast({ title: "AI Draft Generated", description: "Review and edit the draft below." });
    } catch (error) {
      console.error("Error generating AI draft:", error);
      toast({ title: "AI Draft Failed", description: "Could not generate an AI draft. Please try again.", variant: "destructive" });
    } finally {
      setIsDrafting(false);
    }
  };

  const handleSendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!userId || !db) {
      toast({ title: "Error", description: "User not identified or database unavailable. Cannot send message.", variant: "destructive" });
      return;
    }
    if (!composeSubject.trim() || !composeBody.trim()) {
      toast({ title: "Missing Fields", description: "Please provide a subject and message body.", variant: "destructive" });
      return;
    }
    setIsSending(true);
    try {
      const messagesRef = collection(db, 'users', userId, 'messages');
      await addDoc(messagesRef, {
        senderId: userId,
        recipientId: 'support@cremecollections.shop', // Standard support recipient
        subject: composeSubject,
        body: composeBody,
        timestamp: serverTimestamp(),
        direction: 'outgoing',
        status: 'sent',
      });
      toast({ title: "Message Sent!", description: "Your message has been sent to support." });
      setComposeSubject('');
      setComposeTopic('');
      setComposeBody('');
      setActiveTab("sent"); // Switch to sent tab after sending
    } catch (error) {
      console.error("Error sending message:", error);
      toast({ title: "Send Failed", description: "Could not send your message. Please try again.", variant: "destructive" });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card className="shadow-lg h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl font-headline flex items-center">
          <Mail className="mr-2 h-5 w-5 text-primary" /> My Inbox
        </CardTitle>
        <CardDescription>Communicate with our support team directly.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="compose"><Edit2 className="mr-1.5 h-4 w-4" />Compose</TabsTrigger>
            <TabsTrigger value="sent"><Send className="mr-1.5 h-4 w-4" />Sent</TabsTrigger>
            <TabsTrigger value="received" disabled><Inbox className="mr-1.5 h-4 w-4" />Received</TabsTrigger>
          </TabsList>
          
          <TabsContent value="compose" className="flex-grow overflow-auto p-1">
            <form onSubmit={handleSendMessage} className="space-y-4">
              <div>
                <Label htmlFor="compose-subject">Subject</Label>
                <Input 
                  id="compose-subject" 
                  value={composeSubject} 
                  onChange={(e) => setComposeSubject(e.target.value)} 
                  placeholder="e.g., Question about my order #12345" 
                  required 
                />
              </div>
              <div>
                <Label htmlFor="compose-topic">Your Topic (for AI Draft)</Label>
                <Input 
                  id="compose-topic" 
                  value={composeTopic} 
                  onChange={(e) => setComposeTopic(e.target.value)} 
                  placeholder="Briefly describe your issue or question" 
                />
                <Button 
                  type="button" 
                  onClick={handleGetAIDraft} 
                  variant="outline" 
                  size="sm" 
                  className="mt-2" 
                  disabled={isDrafting || !composeTopic.trim()}
                >
                  {isDrafting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MessageSquare className="mr-2 h-4 w-4" />}
                  Get AI Draft
                </Button>
              </div>
              <div>
                <Label htmlFor="compose-body">Message</Label>
                <Textarea 
                  id="compose-body" 
                  value={composeBody} 
                  onChange={(e) => setComposeBody(e.target.value)} 
                  placeholder="Write your message here, or let AI draft it for you..." 
                  rows={8} 
                  required 
                />
              </div>
              <Button type="submit" disabled={isSending || !composeSubject.trim() || !composeBody.trim()}>
                {isSending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                Send Message
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="sent" className="flex-grow overflow-hidden">
            {isLoadingSent ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : sentMessages.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                <Send className="mx-auto h-12 w-12 mb-4" />
                <p>You haven't sent any messages yet.</p>
              </div>
            ) : (
              <ScrollArea className="h-full pr-3">
                <div className="space-y-3">
                  {sentMessages.map((msg) => (
                    <Card key={msg.id} className="bg-muted/50">
                      <CardHeader className="p-3">
                        <CardTitle className="text-sm font-medium">{msg.subject}</CardTitle>
                        <CardDescription className="text-xs">
                          To: {msg.recipientId} | Sent: {msg.timestamp ? format(msg.timestamp.toDate(), 'PPpp') : 'N/A'}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-3 pt-0">
                        <p className="text-xs whitespace-pre-wrap">{msg.body}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            )}
          </TabsContent>

          <TabsContent value="received" className="flex-grow overflow-auto p-1">
             <div className="text-center py-10 text-muted-foreground">
                <Inbox className="mx-auto h-12 w-12 mb-4" />
                <p>Received messages will appear here.</p>
                <p className="text-xs">(Feature coming soon)</p>
              </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}