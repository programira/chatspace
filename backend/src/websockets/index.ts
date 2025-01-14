// import { Server } from 'ws';
// import { Server as HttpServer } from 'http';

// let activeConnections: Set<string> = new Set();

// export const setupWebSocket = (server: HttpServer) => {
//   const wss = new Server({ server });

//   wss.on('connection', (ws) => {
//     console.log('New client connected.');

//     // Generate a unique ID for the connection
//     const connectionId = Date.now().toString();
//     activeConnections.add(connectionId);

//     // Send a welcome message
//     ws.send(JSON.stringify({ type: 'welcome', message: 'Welcome to ChatSpace!' }));

//     ws.on('message', (message) => {
//       const parsedMessage = JSON.parse(message.toString());

//       if (parsedMessage.type === 'newMessage') {
//         // Broadcast the new message to all connected clients
//         wss.clients.forEach((client) => {
//           if (client !== ws && client.readyState === ws.OPEN) {
//             client.send(JSON.stringify(parsedMessage));
//           }
//         });
//       }
//     });

//     ws.on('close', () => {
//       console.log('Client disconnected.');
//       activeConnections.delete(connectionId);
//     });
//   });

//   console.log('WebSocket server initialized.');
// };

import { Server, WebSocket } from 'ws';
import { Server as HttpServer } from 'http';
import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { addParticipant, removeParticipant } from '../store/participantsSlice';

interface ActiveUser {
  userId: string;
  userName: string;
  ws: WebSocket;
}

const activeUsers: ActiveUser[] = [];

export const setupWebSocket = (server: HttpServer) => {
  const wss = new Server({ server });
  const dispatch = useDispatch();

  wss.on('connection', (ws) => {
    console.log('New client connected.');

    ws.on('message', (message) => {
      try {
        const parsedMessage = JSON.parse(message.toString());

        switch (parsedMessage.type) {
          case 'login':
            handleUserLogin(ws, parsedMessage.userId, parsedMessage.userName);
            dispatch(addParticipant(parsedMessage.participant)); // TODO: Check this part
            break;

          case 'newMessage':
            handleNewMessage(parsedMessage);
            break;

          default:
            console.warn('Unknown message type:', parsedMessage.type);
        }
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    });

    ws.on('close', () => {
      handleUserDisconnect(ws);
    });
  });

  console.log('WebSocket server initialized.');
};

/**
 * Handle user login: Add the user to the activeUsers list and broadcast the login.
 */
const handleUserLogin = (ws: WebSocket, userId: string, userName: string) => {
  // Add the user to the activeUsers list
  activeUsers.push({ userId, userName, ws });

  console.log(`${userName} logged in.`);

  // Broadcast to all clients that a new user has joined
  broadcastMessage({
    type: 'userLoggedIn',
    userId,
    userName,
    joinedAt: new Date().toISOString(),
  });

  // Broadcast a "Meetingbot" message to announce the login
  broadcastMessage({
    type: 'newMessage',
    senderId: 'Meetingbot',
    userName: 'Meetingbot',
    text: `${userName} joined the chat.`,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Handle user disconnect: Remove the user from activeUsers and broadcast the logout.
 */
const handleUserDisconnect = (ws: WebSocket) => {
  const userIndex = activeUsers.findIndex((user) => user.ws === ws);
  if (userIndex !== -1) {
    const disconnectedUser = activeUsers[userIndex];
    activeUsers.splice(userIndex, 1); // Remove the user from the activeUsers list

    console.log(`${disconnectedUser.userName} disconnected.`);

    // Broadcast to all clients that the user has left
    broadcastMessage({
      type: 'userLoggedOut',
      userId: disconnectedUser.userId,
      userName: disconnectedUser.userName,
    });
  }
};

/**
 * Handle a new chat message: Broadcast it to all connected clients.
 */
const handleNewMessage = (message: any) => {
  const { userId, text } = message;

  // Find the sender's name
  const sender = activeUsers.find((user) => user.userId === userId);
  if (!sender) {
    console.warn('Sender not found:', userId);
    return;
  }

  // Broadcast the new message to all clients
  broadcastMessage({
    type: 'newMessage',
    userId: sender.userId,
    userName: sender.userName,
    text,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Broadcast a message to all connected clients.
 */
const broadcastMessage = (message: any) => {
  activeUsers.forEach((user) => {
    if (user.ws.readyState === WebSocket.OPEN) {
      user.ws.send(JSON.stringify(message));
    }
  });
};
