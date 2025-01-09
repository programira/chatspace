import React, { useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import * as ReactEmoji from 'react-emoji';

interface Message {
  id: number;
  name: string;
  text: string;
  time: string;
}

const Chat: React.FC<{ userName: string }> = ({ userName }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, name: 'Alice', text: 'Hello everyone! 😊', time: '10:15' },
    { id: 2, name: 'Bob', text: 'Hi Alice! How are you? 😄', time: '10:16' },
    { id: 3, name: 'Charlie', text: 'Good morning! ☀️', time: '10:17' },
  ]);
  const [newMessage, setNewMessage] = useState<string>('');

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const currentTime = new Date();
    const formattedTime = `${currentTime.getHours()}:${currentTime
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;

    const message: Message = {
      id: messages.length + 1,
      name: userName,
      text: newMessage,
      time: formattedTime,
    };

    setMessages((prevMessages) => [...prevMessages, message]);
    setNewMessage('');
  };

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
        height: '100%',
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
                {message.name}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: 'gray', fontSize: '0.85rem' }}
              >
                {message.time}
              </Typography>
            </Box>
            <Typography variant="body2">{ReactEmoji.emojify(message.text)}</Typography>
          </Box>
        ))}
      </Box>

      {/* Message Input Box */}
      <Box sx={{ display: 'flex', gap: 1, borderTop: '1px solid #ccc', paddingTop: 1 }}>
        <TextField
          fullWidth
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          sx={{ backgroundColor: '#fff', borderRadius: 1 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSend}
          sx={{ textTransform: 'none' }}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default Chat;
