import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ConnectionState } from '../types/Connection';

const initialState: ConnectionState = {
  isConnected: false,
  reconnectAttempts: 0,
};

const connectionSlice = createSlice({
  name: 'connection',
  initialState,
  reducers: {
    setConnectionStatus: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
    incrementReconnectAttempts: state => {
      state.reconnectAttempts += 1;
    },
    setConnectionError: (state, action: PayloadAction<string>) => {
      state.errorMessage = action.payload;
    },
  },
});

export const {
  setConnectionStatus,
  incrementReconnectAttempts,
  setConnectionError,
} = connectionSlice.actions;

export default connectionSlice.reducer;
