
'use server';

import { Timestamp } from 'firebase/firestore';

export interface Message {
  id: string;
  userId: string;
  from: string; // e.g., 'Creme Collections Support', 'System Notification'
  subject: string;
  body: string;
  isRead: boolean;
  receivedAt: Date | Timestamp;
}

const MOCK_MESSAGES: Message[] = [
  {
    id: 'msg_1',
    userId: 'mock_user_google.user@example.com',
    from: 'Creme Collections Support',
    subject: 'Your Order #CR12345 has been delivered!',
    body: 'Hello! We are pleased to inform you that your order #CR12345 has been successfully delivered. We hope you enjoy your products! Please feel free to leave a review.',
    isRead: false,
    receivedAt: new Date('2024-06-20T12:00:00Z'),
  },
  {
    id: 'msg_2',
    userId: 'mock_user_google.user@example.com',
    from: 'System Notification',
    subject: 'Welcome to Creme Collections!',
    body: 'Welcome to the family! We are so excited to have you on board. As a welcome gift, please enjoy 10% off your next purchase with code WELCOME10.',
    isRead: true,
    receivedAt: new Date('2024-06-18T09:00:00Z'),
  },
    {
    id: 'msg_3',
    userId: 'mock_user_google.user@example.com',
    from: 'Creme Collections Support',
    subject: 'Your Order #CR12346 has shipped',
    body: 'Good news! Your order #CR12346 is now on its way to you. You can track it using the tracking number XYZ123456.',
    isRead: true,
    receivedAt: new Date('2024-06-22T16:00:00Z'),
  },
];


export async function getUserMessages(userId: string): Promise<Message[]> {
  console.log(`[Mock Service] Called getUserMessages for user ${userId}.`);
  // In a real app, you would fetch from Firestore where(userId, '==', userId)
  return MOCK_MESSAGES.filter(msg => msg.userId === userId).sort((a,b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime());
}

export async function markMessageAsRead(userId: string, messageId: string): Promise<boolean> {
    console.log(`[Mock Service] Called markMessageAsRead for user ${userId}, message ${messageId}. This is a mock and won't persist.`);
    return true;
}
