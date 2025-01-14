import { User } from './User';
export interface Participant {
  id: string;
  userId: string;
  joinedAt: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  user: User;
}