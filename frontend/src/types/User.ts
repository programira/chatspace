export interface User {
  id: string;
  name: string;
  // isActive: boolean; // moved to Participant (session)
  createdAt: string;
  updatedAt: string;
}
