import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../types/User';

interface UserState {
  currentUser: User | null;
  isLoggedIn: boolean;
  selectedUser: string | null;
}

const initialState: UserState = {
  currentUser: null,
  isLoggedIn: false,
  selectedUser: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
      state.isLoggedIn = true; // Set login state
    },
    clearUser: (state) => {
      state.currentUser = null;
      state.isLoggedIn = false; // Reset login state
    },
    setSelectedUser: (state, action: PayloadAction<string | null>) => {
      state.selectedUser = action.payload;
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
  },
});

export const { setUser, clearUser, setSelectedUser, clearSelectedUser } = userSlice.actions;

export default userSlice.reducer;
