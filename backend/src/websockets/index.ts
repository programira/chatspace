import { Server, WebSocket } from "ws";
import { Server as HttpServer } from "http";

interface ActiveUser {
  userId: string;
  name: string;
  ws: WebSocket;
}

const activeUsers: ActiveUser[] = [];

export const setupWebSocket = (server: HttpServer) => {
  const wss = new Server({ server });

  wss.on("connection", (ws, req) => {
    const clientPort = req.socket.remotePort;
    console.log("New client connected on port:", clientPort);

    ws.on("message", (message) => {
      try {
        const parsedMessage = JSON.parse(message.toString());
        console.log("Received message:", parsedMessage);

        switch (parsedMessage.type) {
          case "login":
            handleUserLogin(
              ws,
              parsedMessage.data.userId,
              parsedMessage.data.name,
              parsedMessage.data.createdAt,
              parsedMessage.data.updatedAt
            );
            break;

          case "message:new":
            handleNewMessage(parsedMessage);
            break;

          case "logout":
            handleUserLogout(parsedMessage.data.userId, parsedMessage.data.name);
            break;

          default:
            console.warn("Unknown message type:", parsedMessage.type);
        }
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    });

    ws.on("close", () => {
      handleUserDisconnect(ws);
    });
  });

  console.log("WebSocket server initialized.");
};

// Handle user login
const handleUserLogin = (
  ws: WebSocket,
  userId: string,
  name: string,
  createdAt: string,
  updatedAt: string
) => {
  console.log("User logged in:", userId, name);
  activeUsers.push({ userId, name, ws });

  console.log(`${name} logged in.`);

  // Broadcast login message
  broadcastMessage({
    type: "userLoggedIn",
    userId,
    name,
    joinedAt: new Date().toISOString(),
  });

  // Broadcast "Meetingbot" message
  broadcastMessage({
    type: "newMessage",
    senderId: "Meetingbot",
    userId: "Meetingbot",
    name: "Meetingbot",
    text: `${name} joined the chat.`,
    // timestamp: new Date().toISOString(),
    createdAt: createdAt,
    updatedAt: updatedAt,
    id: `Meetingbot-${userId}`,
  });
};

// Handle new message
const handleNewMessage = (message: any) => {
  broadcastMessage({
    type: "newMessage",
    userId: message.data.senderId, // This can be removed
    senderId: message.data.senderId,
    senderName: message.data.senderName,
    text: message.data.text,
    // timestamp: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
};

// Handle user logout
const handleUserLogout = (userId: string, name: string) => {
  activeUsers.splice(
    activeUsers.findIndex((u) => u.userId === userId),
    1
  );

  // Broadcast logout message
  broadcastMessage({
    type: "userLoggedOut",
    userId,
    name,
  });

  // Broadcast "Meetingbot" message
  broadcastMessage({
    type: "newMessage",
    senderId: "Meetingbot",
    userId: "Meetingbot",
    name: "Meetingbot",
    text: `${name} left the chat.`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),

    id: `Meetingbot-${userId}`,
  });
};


// Broadcast messages to all clients
const broadcastMessage = (message: any) => {
  console.log("Broadcasting message:", message);
  activeUsers.forEach((user) => {
    if (user.ws.readyState === WebSocket.OPEN) {
      user.ws.send(JSON.stringify(message));
      console.log("Sent message to:", user.name);
    }
  });
};

/**
 * Handles user disconnection by removing them from the activeUsers list
 * and broadcasting a logout event.
 */
const handleUserDisconnect = (ws: WebSocket) => {
  const userIndex = activeUsers.findIndex((user) => user.ws === ws);
  if (userIndex !== -1) {
    const disconnectedUser = activeUsers[userIndex];
    activeUsers.splice(userIndex, 1); // Remove the user from activeUsers list

    console.log(`${disconnectedUser.name} disconnected.`);

    // Broadcast to all clients that the user has left
    broadcastMessage({
      type: "userLoggedOut",
      userId: disconnectedUser.userId,
      name: disconnectedUser.name,
    });

    // Broadcast "Meetingbot" message
    broadcastMessage({
      type: "newMessage",
      senderId: "Meetingbot",
      name: "Meetingbot",
      text: `${disconnectedUser.name} left the chat.`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      id: `Meetingbot-${disconnectedUser.name}`,
    });
  }
};
