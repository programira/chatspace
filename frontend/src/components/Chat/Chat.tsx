import React, { useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
// import * as ReactEmoji from 'react-emoji';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { addMessage } from '../../store/messagesSlice';
import { Message } from '../../types/Message';

const Chat: React.FC = () => {
  //   const [messages, setMessages] = useState<Message[]>([
  //     { id: 1, name: 'Alice', text: 'Hello everyone! 😊', time: '10:15' },
  //     { id: 2, name: 'Bob', text: 'Hi Alice! How are you? 😄', time: '10:16' },
  //     { id: 3, name: 'Charlie', text: 'Good morning! ☀️', time: '10:17' },
  //   ]);

  const dispatch = useDispatch<AppDispatch>();
  const { currentUser, isLoggedIn } = useSelector((state: RootState) => state.user);
  const messages: Message[] = useSelector((state: RootState) => state.messages.list); // Use the Message type
  const [newMessage, setNewMessage] = useState('');

  const handleSend = () => {
    if (!newMessage.trim() || !currentUser) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      text: newMessage,
      timestamp: new Date().toISOString(),
    };

    dispatch(addMessage(newMsg)); // Dispatch the new message to the Redux store
    setNewMessage(''); // Clear the input field
  };

  if (!isLoggedIn) {
    return <div>Please log in to participate in the chat.</div>;
  }

  return (
    <Box
      sx={{
        flex: 3,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 2,
        backgroundColor: '#e0e0e0',
        borderRadius: 1,
        color: '#000',
        // height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Chat Messages */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Typography variant="h6">Chat</Typography>
        {messages.map((message) => (
          <Box
            key={message.id}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              padding: 1.5,
              backgroundColor: '#fff',
              borderRadius: 1,
              boxShadow: 1,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 0.5,
              }}
            >
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                {message.senderId === currentUser?.id ? 'You' : message.senderId}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: 'gray', fontSize: '0.85rem' }}
              >
                {new Date(message.timestamp).toLocaleTimeString()}
              </Typography>
            </Box>
            <Typography variant="body2">{message.text}</Typography>
          </Box>
        ))}
      </Box>

      <Box sx={{ display: 'flex', gap: 1, borderTop: '1px solid #ccc', paddingTop: 1 }}>
        <TextField
          fullWidth
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          sx={{ backgroundColor: '#fff', borderRadius: 1 }}
        />
        <Button variant="contained" color="primary" onClick={handleSend}>
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default Chat;