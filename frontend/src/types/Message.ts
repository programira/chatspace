export interface Message {
  id: string;
  senderId: string;
  text: string;
  createdAt: string;
  updatedAt: string;
  senderName: string; 
  messageSender?: {
    name: string;
  }
  receiverId?: string;
}
