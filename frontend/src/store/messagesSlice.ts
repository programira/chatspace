import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Message } from '../types/Message';

interface MessagesState {
  list: Message[];
}

const initialState: MessagesState = {
  list: [],
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      state.list.push(action.payload);
    },
    clearMessages: state => {
      state.list = [];
    },
  },
});

export const { addMessage, clearMessages } = messagesSlice.actions;

export default messagesSlice.reducer;
