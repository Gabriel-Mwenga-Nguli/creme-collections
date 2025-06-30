
'use server';

import { db, isConfigured } from '@/lib/firebase';
import { collection, query, where, orderBy, getDocs, doc, updateDoc, Timestamp } from 'firebase/firestore';

export interface Message {
  id: string;
  userId: string;
  from: string;
  subject: string;
  body: string;
  isRead: boolean;
  receivedAt: Date | Timestamp;
}

const fromFirestore = (docSnap: any): Message => {
  const data = docSnap.data();
  return {
    id: docSnap.id,
    ...data,
    receivedAt: data.receivedAt instanceof Timestamp ? data.receivedAt.toDate() : new Date(),
  } as Message;
};

export async function getUserMessages(userId: string): Promise<Message[]> {
  if (!isConfigured || !db || !userId) return [];
  const messagesRef = collection(db, `users/${userId}/messages`);
  const q = query(messagesRef, orderBy('receivedAt', 'desc'));
  try {
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      console.log("No messages found for user:", userId);
      return [];
    }
    return querySnapshot.docs.map(fromFirestore);
  } catch (error) {
    console.error("Error fetching user messages:", error);
    return [];
  }
}

export async function markMessageAsRead(userId: string, messageId: string): Promise<boolean> {
  if (!isConfigured || !db || !userId || !messageId) return false;
  const messageRef = doc(db, `users/${userId}/messages`, messageId);
  try {
    await updateDoc(messageRef, { isRead: true });
    return true;
  } catch (error) {
    console.error("Error marking message as read:", error);
    return false;
  }
}
