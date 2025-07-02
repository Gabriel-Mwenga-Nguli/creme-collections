
'use server';

import { Timestamp } from 'firebase/firestore';

export interface Message {
  id: string;
  userId: string;
  from: string;
  subject: string;
  body: string;
  isRead: boolean;
  receivedAt: Date | Timestamp;
}

// Mocked Service Function for Demo Mode

export async function getUserMessages(userId: string): Promise<Message[]> {
  if (!userId) return [];
  console.log(`[Demo Mode] getUserMessages called for user ${userId}. Returning mock welcome message.`);
  return [
    {
      id: 'welcome-1',
      userId: userId,
      from: 'Creme Collections Support',
      subject: 'Welcome to Your Inbox!',
      body: 'This is your message center. Important notifications about your orders, account, and replies from support will appear here. Since the app is in demo mode, this is a sample message.',
      isRead: false,
      receivedAt: new Date(),
    }
  ];
}

export async function markMessageAsRead(userId: string, messageId: string): Promise<boolean> {
  console.log(`[Demo Mode] markMessageAsRead called for user ${userId}, message ${messageId}.`);
  return true;
}
