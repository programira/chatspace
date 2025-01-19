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
    // Fetch & set initial messages
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.list = action.payload;
    },

    // Add a new message to the chat
    addMessage: (state, action: PayloadAction<Message>) => {
      
      state.list.push(action.payload);
    },

    // Update an existing message (for edits or marking as deleted)
    updateMessage: (state, action: PayloadAction<Message>) => {
      const index = state.list.findIndex((msg) => msg.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },

    // Remove a deleted message (if needed)
    removeMessage: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter((msg) => msg.id !== action.payload);
    },

    // Clear all messages (e.g., when logging out or refreshing)
    clearMessages: (state) => {
      state.list = [];
    },
  },
});

export const { setMessages, addMessage, updateMessage, removeMessage, clearMessages } = messagesSlice.actions;
export default messagesSlice.reducer;
