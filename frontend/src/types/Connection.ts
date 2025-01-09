export interface ConnectionState {
  isConnected: boolean; // Is the WebSocket connected
  reconnectAttempts: number;
  errorMessage?: string;
}
