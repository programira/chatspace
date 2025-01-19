import { configureStore } from '@reduxjs/toolkit';
import participantsReducer from './participantsSlice';
import messagesReducer from './messagesSlice';
import connectionReducer from './connectionSlice';
import userReducer from './userSlice';
import webSocketReducer from './webSocketSlice'; 

export const store = configureStore({
  reducer: {
    participants: participantsReducer, // Manages participants state
    messages: messagesReducer,         // Manages chat messages
    connection: connectionReducer,     // Manages WebSocket connection state
    user: userReducer,                 // Manages logged-in user state
    webSocket: webSocketReducer,       // Manages WebSocket message handling
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
