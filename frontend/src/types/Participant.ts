import { User } from './User';

export interface Participant extends User {
  joinedAt: string;
}
