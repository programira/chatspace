import api from '../config/api'; // Assuming you have an api.ts for Axios configuration
import { User } from '../types/User';
import { Participant } from '../types/Participant';

// Fetch all users
export const fetchUsers = async (): Promise<User[]> => {
  const response = await api.get('/api/users');
  return response.data;
};

// Create a new user
export const createUser = async (name: string): Promise<User> => {
  const response = await api.post('/api/users', { name });
  return response.data;
};

// Fetch the current user by ID
export const fetchUserById = async (id: string): Promise<User> => {
  const response = await api.get(`api/users/${id}`);
  return response.data;
};

// Logout user by removing them from the participant table
export const logoutUser = async (userId: string): Promise<void> => {
    console.log('logoutUser called', userId);
    await api.delete(`/api/participants/${userId}`);
};

// Fetch all participants
export const fetchParticipants = async (): Promise<Participant[]> => {
    const response = await api.get('/api/participants');
    return response.data;
  };

// Fetch participant by user ID
export const fetchParticipantByUserId = async (userId: string): Promise<Participant> => {
    const response = await api.get(`api/participants/user/${userId}`);
    return response.data;
  };