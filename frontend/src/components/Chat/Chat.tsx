import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, TextField, Button, IconButton } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchRecentMessages, createMessage, editMessage, deleteMessage } from '../../services/messageService';
import { setMessages, addMessage, updateMessage } from '../../store/messagesSlice';
import { Message } from '../../types/Message';
import CustomPreview from '../CustomPreview/CustomPreview';
import { Edit, Delete, EmojiEmotions, Gif } from '@mui/icons-material'; // Add EmojiEmotions icon
import EmojiPicker from 'emoji-picker-react';
import { GiphyFetch } from '@giphy/js-fetch-api';
import { Grid } from '@giphy/react-components';
import { GIPHY_API_KEY } from '../../config/constants';
import { sendWebSocketMessage } from '../../store/webSocketSlice';

const gf = new GiphyFetch(GIPHY_API_KEY);

const Chat: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentUser, isLoggedIn } = useSelector((state: RootState) => state.user);
  const messages: Message[] = useSelector((state: RootState) => state.messages.list);
  const [messageInput, setMessageInput] = useState('');
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);

  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);

  const [isGiphyOpen, setIsGiphyOpen] = useState(false);
  const [gifResults, setGifResults] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('trending');

  // Ref to track the last message for auto-scroll
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to last message when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]); // Runs every time messages change

  // Fetch messages when the chat session starts
  useEffect(() => {
    const loadMessages = async () => {
      const messagesFromApi = await fetchRecentMessages();
      dispatch(setMessages(messagesFromApi));
    };

    loadMessages();

  }, [dispatch]);

  // Send or edit message
  const handleSend = async () => {
    if (!messageInput.trim() || !currentUser) return;

    if (editingMessageId) {
      // Editing existing message
      const updatedMessage = await editMessage(editingMessageId, messageInput, currentUser.id);
      const formattedMsg = {
        ...updatedMessage,
        senderName: currentUser.name,
      };
      dispatch(updateMessage(formattedMsg));
      dispatch(sendWebSocketMessage('message:edit', formattedMsg));
      setEditingMessageId(null);
    } else {
      // Sending new message
      const newMsg = await createMessage(messageInput, currentUser.id);
      const formattedMsg = {
        ...newMsg,
        senderName: currentUser.name,
      };
      dispatch(addMessage(formattedMsg));
      dispatch(sendWebSocketMessage('message:new', formattedMsg));
    }

    setMessageInput('');
  };

  // Handle edit click
  const handleEdit = (message: Message) => {
    setMessageInput(message.text);
    setEditingMessageId(message.id);
  };

  // Handle delete message
  const handleDelete = async (id: string) => {
    if (!currentUser) return;
    const updatedMessage = await deleteMessage(id, currentUser.id);
    dispatch(updateMessage(updatedMessage));
    dispatch(sendWebSocketMessage('message:delete', updatedMessage));
  };

  // Cancel editing when pressing ESC
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && editingMessageId) {
      setEditingMessageId(null);
      setMessageInput('');
    }
  };

  // Add emoji to message input
  const handleEmojiClick = (emojiObject: { emoji: string }) => {
    setMessageInput((prev) => prev + emojiObject.emoji);
  };

  if (!isLoggedIn) {
    return <div>Please log in to participate in the chat.</div>;
  }

  const renderMessageWithLinks = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);

    return parts.map((part, index) =>
      part.match(urlRegex) ? <CustomPreview key={index} url={part} /> : part
    );
  };

  // Fetch GIFs from Giphy API
  const fetchGifs = (offset: number = 0) => gf.search(searchTerm, { limit: 8, offset });

  // Insert GIF URL into input field (just like emojis)
  const handleSelectGif = async (gifUrl: string) => {
    setMessageInput((prev) => prev + ' ' + gifUrl);
    setIsGiphyOpen(false);
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
        overflow: 'hidden',
        height: '97%',
        position: 'relative',
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
          paddingBottom: '80px',
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
              backgroundColor: message.senderId === 'Meetingbot' ? '#f0f0f0' : '#fff',
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
                {message.senderId === 'Meetingbot'
                  ? 'Meetingbot'
                  : message.senderId === currentUser?.id
                    ? 'You'
                    : message.senderName || message.messageSender?.name}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: 'gray', fontSize: '0.85rem' }}
              >
                {message.createdAt === message.updatedAt
                  ? new Date(message.createdAt).toISOString().replace('T', ' ').split('.')[0]
                  : `edited @ ${new Date(message.updatedAt).toISOString().replace('T', ' ').split('.')[0]}`}
              </Typography>
            </Box>

            {/* If message is a Giphy link, render an image */}
            {message.text.includes('giphy.com/media') ? (
              <img
                src={message.text}
                alt="GIF"
                width="150"
                style={{ borderRadius: 8 }}
              />
            ) : (
              <Typography
                variant="body2"
                sx={{
                  fontStyle: message.senderId === 'Meetingbot' ? 'italic' : 'normal',
                }}
              >
                {renderMessageWithLinks(message.text)}
              </Typography>

            )}

            {/* Edit & Delete Buttons */}
            {message.senderId === currentUser?.id && (
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', marginTop: 0.5 }}>
                <IconButton size="small" onClick={() => handleEdit(message)}>
                  <Edit fontSize="small" sx={{ color: '#1976d2' }} />
                </IconButton>
                <IconButton size="small" onClick={() => handleDelete(message.id)}>
                  <Delete fontSize="small" sx={{ color: 'red' }} />
                </IconButton>
              </Box>
            )}
          </Box>
        ))}
        {/* This div ensures auto-scrolling always happens */}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input Box */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '98%',
          display: 'flex',
          gap: 1,
          padding: 2,
          backgroundColor: '#e0e0e0',
          borderTop: '1px solid #ccc',
          zIndex: 1000,
        }}>
        <TextField
          fullWidth
          placeholder="Type your message..."
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyDown={handleKeyDown} // Detect ESC key press
          sx={{ backgroundColor: '#fff', borderRadius: 1 }}
        />
        <IconButton onClick={() => setIsEmojiPickerOpen((prev) => !prev)} color="primary">
          <EmojiEmotions />
        </IconButton>
        <IconButton onClick={() => setIsGiphyOpen((prev) => !prev)} color="secondary">
          <Gif />
        </IconButton>
        <Button variant="contained" color="primary" onClick={handleSend}>
          {editingMessageId ? 'Update' : 'Send'}
        </Button>
      </Box>
      {/* Emoji Picker */}
      {isEmojiPickerOpen && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 90,
            right: 31,
            zIndex: 10
          }}>
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </Box>
      )}

      {/* Giphy Picker */}
      {isGiphyOpen && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 90,
            right: 30,
            zIndex: 10,
            backgroundColor: '#fff',
            padding: 2,
            borderRadius: 2,
            boxShadow: 3,
            width: 320,
            maxHeight: 300,
            overflowY: 'auto',
          }}
        >
          <TextField
            fullWidth
            placeholder="Search GIFs..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Grid
            width={300}
            columns={3}
            fetchGifs={(offset) => fetchGifs(offset)}
            onGifClick={(gif, e) => {
              e.preventDefault();
              handleSelectGif(gif.images.fixed_height.url);
            }}
          />
        </Box>
      )}


    </Box>
  );
};

export default Chat;