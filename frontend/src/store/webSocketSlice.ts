import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from './index';
import { addMessage, updateMessage, removeMessage } from './messagesSlice';
import { WS_URL } from '../config/constants';
import { Message } from '../types/Message';
import { setParticipants } from './participantsSlice';
import { fetchParticipants } from '../services/userService';

interface WebSocketState {
  isConnected: boolean;
  error: string | null;
}

const initialState: WebSocketState = {
  isConnected: false,
  error: null,
};

let ws: WebSocket | null = null;

const webSocketSlice = createSlice({
  name: 'webSocket',
  initialState,
  reducers: {
    setConnected: state => {
      state.isConnected = true;
      state.error = null;
    },
    setDisconnected: state => {
      state.isConnected = false;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

// Actions
export const { setConnected, setDisconnected, setError } =
  webSocketSlice.actions;

// WebSocket Thunk (to manage connection globally)
export const initializeWebSocket =
  () => (dispatch: AppDispatch, getState: () => RootState) => {
    if (ws) {
      ws.close(); // Close existing connection if any
    }

    ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      console.log('WebSocket connected globally.');
      dispatch(setConnected());
    };

    ws.onmessage = async event => {
      const message = JSON.parse(event.data);
      console.log('Received WebSocket message:', message);

      const currentUser = getState().user.currentUser; // Get current user from Redux

      // Skip processing messages sent by the current user
      if (currentUser && message.senderId === currentUser.id) {
        console.log('Skipping message from current user:', message);
        return;
      }

      switch (message.type) {
        case 'userLoggedIn': {
          console.log('message.type userLoggedIn ', message);
          const participants = await fetchParticipants();
          dispatch(setParticipants(participants));
          dispatch(setConnected());
          break;
        }

        case 'userLoggedOut': {
          console.log('message.type userLoggedOut ', message);
          const participants = await fetchParticipants();
          dispatch(setParticipants(participants));
          dispatch(setConnected());
          break;
        }

        case 'newMessage': {
          const formattedMessage: Message = {
            id: message.id,
            senderId: message.senderId,
            text: message.text,
            createdAt: message.createdAt,
            updatedAt: message.updatedAt,
            senderName: message.senderName,
            receiverId: message.receiverId,
          };

          dispatch(addMessage(formattedMessage));
          break;
        }

        case 'message:edit':
            { const formattedMessage: Message = {
                id: message.id,
                senderId: message.senderId,
                text: message.text,
                createdAt: message.createdAt,
                updatedAt: message.updatedAt,
                senderName: message.senderName,
              };
          dispatch(updateMessage(formattedMessage));
          break; }

        case 'message:delete':
          dispatch(removeMessage(message.data));
          break;

        default:
          console.warn('Unhandled message type:', message.type);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected.');
      dispatch(setDisconnected());
    };

    ws.onerror = error => {
      console.error('WebSocket error:', error);
      dispatch(setError('WebSocket connection error.'));
    };
  };

// Function to send messages via WebSocket
export const sendWebSocketMessage = (type: string, data: unknown) => () => {
  if (ws && ws.readyState === WebSocket.OPEN) {
    console.log('Sending WebSocket message:', { type, data });
    ws.send(JSON.stringify({ type, data }));
  }
};

// Selector to check WebSocket state
export const selectWebSocketState = (state: RootState) => state.webSocket;

export default webSocketSlice.reducer;
