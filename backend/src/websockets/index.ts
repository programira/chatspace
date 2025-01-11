import { Server } from 'ws';
import { Server as HttpServer } from 'http';

let activeConnections: Set<string> = new Set();

export const setupWebSocket = (server: HttpServer) => {
  const wss = new Server({ server });

  wss.on('connection', (ws) => {
    console.log('New client connected.');

    // Generate a unique ID for the connection
    const connectionId = Date.now().toString();
    activeConnections.add(connectionId);

    // Send a welcome message
    ws.send(JSON.stringify({ type: 'welcome', message: 'Welcome to ChatSpace!' }));

    ws.on('message', (message) => {
      const parsedMessage = JSON.parse(message.toString());

      if (parsedMessage.type === 'newMessage') {
        // Broadcast the new message to all connected clients
        wss.clients.forEach((client) => {
          if (client !== ws && client.readyState === ws.OPEN) {
            client.send(JSON.stringify(parsedMessage));
          }
        });
      }
    });

    ws.on('close', () => {
      console.log('Client disconnected.');
      activeConnections.delete(connectionId);
    });
  });

  console.log('WebSocket server initialized.');
};
