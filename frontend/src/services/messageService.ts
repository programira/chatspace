import api from '../config/api';
import { Message } from '../types/Message';

// Fetch all messages
export const fetchMessages = async (): Promise<Message[]> => {
//   const response = await api.get('/api/messages');
//   return response.data;
try {
    const response = await fetch('/api/messages'); // Adjust API endpoint if needed
    const data = await response.json();

    // Transform messages to replace "messageSender" with "senderName" TODO: Add this to the fetch with recent
    return data.map((msg: any) => ({
      ...msg,
      senderName: msg.messageSender?.name || 'Unknown',
    }));
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
};

// Create a new message
export const createMessage = async (text: string, senderId: string): Promise<Message> => {
  const response = await api.post('/api/messages', { text, senderId });
  return response.data;
};

// Create a new message
export const createPrivateMessage = async (text: string, senderId: string, receiverId: string): Promise<Message> => {
  const response = await api.post('/api/messages', { text, senderId, receiverId });
  return response.data;
};

// Edit an existing message
export const editMessage = async (id: string, newText: string, senderId: string): Promise<Message> => {
  const response = await api.put(`/api/messages/${id}`, { text: newText, senderId });
  return response.data;
};

// Delete a message (mark as deleted)
export const deleteMessage = async (id: string, senderId: string): Promise<Message> => {
    const response = await api.put(`/api/messages/${id}/delete`, { senderId });
    return response.data;
};

// Fetch recent messages (e.g., last 20 messages)
export const fetchRecentMessages = async (): Promise<Message[]> => {
    const response = await api.get('/api/messages?limit=5'); // Adjust limit as needed
    return response.data;
};

// Fetch private messages between a user and receiver
export const fetchPrivateMessages = async (userId: string, receiverId: string): Promise<Message[]> => {
    const response = await api.get(`/api/messages/private/${userId}/${receiverId}`);
    return response.data;
};
  