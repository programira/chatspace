// import { useEffect, useRef } from 'react';
// import { useDispatch } from 'react-redux';
// import { addParticipant, removeParticipant } from '../store/participantsSlice';

// const useWebSocket = (url: string, userId: string, userName: string) => {
//   const ws = useRef<WebSocket | null>(null);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     ws.current = new WebSocket(url);

//     ws.current.onopen = () => {
//       console.log('WebSocket connected.');
//       ws.current?.send(
//         JSON.stringify({ type: 'login', userId, userName })
//       );
//     };

//     ws.current.onmessage = (event) => {
//       const message = JSON.parse(event.data);
//       if (message.type === 'userLoggedIn') {
//         dispatch(addParticipant({
//             id: message.userId, name: message.userName, isActive: true,
//             joinedAt: message.joinedAt
//         }));
//       } else if (message.type === 'userLoggedOut') {
//         dispatch(removeParticipant(message.userId));
//       }
//     };

//     ws.current.onclose = () => {
//       console.log('WebSocket disconnected.');
//     };

//     return () => {
//       ws.current?.close();
//     };
//   }, [url, userId, userName, dispatch]);

//   return ws.current;
// };

// export default useWebSocket;

import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { addParticipant, removeParticipant } from '../store/participantsSlice';
import { addMessage } from '../store/messagesSlice';

// Hook accepts only the WebSocket URL during initialization
const useWebSocket = (url: string) => {
  const ws = useRef<WebSocket | null>(null); // WebSocket instance reference
  const dispatch = useDispatch();

  useEffect(() => {
    // Initialize WebSocket connection
    ws.current = new WebSocket(url);

    ws.current.onopen = () => {
      console.log('WebSocket connected.');
    };

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);

      switch (message.type) {
        case 'userLoggedIn':
          // Add the new participant
          dispatch(addParticipant({
            id: message.userId,
            name: message.userName,
            isActive: true,
            joinedAt: message.joinedAt,
          }));

          // Add a system message to the chat
          dispatch(addMessage({
            id: Date.now().toString(), // Unique ID for the message
            senderId: 'Meetingbot',
            text: `${message.userName} joined the chat.`,
            timestamp: new Date().toISOString(),
          }));
          break;

        case 'userLoggedOut':
          // Remove the participant
          dispatch(removeParticipant(message.userId));

          // Add a system message to the chat
          dispatch(addMessage({
            id: Date.now().toString(),
            senderId: 'Meetingbot',
            text: `${message.userName} left the chat.`,
            timestamp: new Date().toISOString(),
          }));
          break;

        case 'systemMessage':
          // Handle other system messages
          dispatch(addMessage({
            id: Date.now().toString(),
            senderId: 'Meetingbot',
            text: message.text,
            timestamp: message.timestamp,
          }));
          break;

        default:
          console.warn('Unhandled message type:', message.type);
      }
    };

    ws.current.onclose = () => {
      console.log('WebSocket disconnected.');
    };

    // Cleanup on unmount
    return () => {
      ws.current?.close();
    };
  }, [url, dispatch]);

  /**
   * Function to send messages dynamically
   * 
   * Pass `userId` and `userName` for initial login messages
   */
  const sendMessage = (message: any) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    }
  };

  return { sendMessage };
};

export default useWebSocket;
