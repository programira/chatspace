import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Tabs, Tab, IconButton } from '@mui/material';
import Header from '../Header/Header';
import { RootState } from '../../store';
import Participants from '../Participants/Participants';
import Chat from '../Chat/Chat';
import CloseIcon from '@mui/icons-material/Close';
import PrivateChat from '../Chat/PrivateChat';
import { setSelectedUser } from '../../store/userSlice';

interface LayoutProps {
  theme: string;
  setTheme: (theme: string) => void;
  userName: string;
}

const Layout: React.FC<LayoutProps> = ({ theme, setTheme }) => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState<string>('group-chat'); // Default to Group Chat
  const [openChats, setOpenChats] = useState<{ id: string; name: string }[]>([]);
  const selectedUser = useSelector((state: RootState) => state.user.selectedUser);
  const participantsList = useSelector((state: RootState) => state.participants.list);
  const selectedUserName = participantsList.find(p => String(p.userId) === String(selectedUser))?.user.name || 'Unknown';

  // Open a new tab when `selectedUser` is updated
  useEffect(() => {
    if (selectedUser && !openChats.some(chat => chat.id === selectedUser)) {
      console.log('Opening chat with:', selectedUser);
      console.log('Participants:', participantsList);
      setOpenChats(prevChats => [...prevChats, { id: selectedUser, name: selectedUserName || 'Unknown' }]);
      setActiveTab(selectedUser);
    }
  }, [selectedUser, selectedUserName]);

  // Update `selectedUser` when switching between group and private chats
  const handleTabChange = (event: React.SyntheticEvent, newTab: string) => {
    setActiveTab(newTab);

    if (newTab === 'group-chat') {
      dispatch(setSelectedUser(null)); // Clear `selectedUser` when switching to group chat
    } else {
      dispatch(setSelectedUser(newTab)); // Set `selectedUser` to the selected private chat user
    }
  };

  // Close a chat tab
  const handleCloseChat = (chatId: string) => {
    setOpenChats(prevChats => {
      const updatedChats = prevChats.filter(chat => chat.id !== chatId);

      // If the closed tab was the active one, set a new active tab
      if (activeTab === chatId) {
        setActiveTab(updatedChats.length > 0 ? updatedChats[updatedChats.length - 1].id : 'group-chat');
      }

      return updatedChats;
    });
    if (selectedUser === chatId) {
      dispatch(setSelectedUser(null)); // Clear `selectedUser` if the closed tab was active
    }
  };

  return (
    <Box
      sx={{
        height: '100vh', // Full viewport height
        width: '100vw', // Full viewport width
        display: 'flex',
        flexDirection: 'column', // Vertical stacking
        backgroundColor: (theme) => theme.palette.background.default,
        color: (theme) => theme.palette.text.primary,
      }}
    >
      {/* Header */}
      <Header theme={theme} setTheme={setTheme} />

      {/* Main Content */}
      <Box
        sx={{
          display: 'flex',
          flex: 1, // Takes remaining space after the header
          padding: 2,
          gap: 2,
        }}
      >
        {/* Participants Section */}
        <Participants />

        {/* Chat Section with Tabs */}
        <Box sx={{ flex: 3, display: 'flex', flexDirection: 'column' }}>
          <Tabs
            value={activeTab}
            // onChange={(e, newValue) => setActiveTab(newValue)}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            {/* Group Chat Tab */}
            <Tab value="group-chat" label="Group Chat" />

            {/* Private Chat Tabs */}
            {openChats.map(chat => (
              <Tab
                key={chat.id}
                value={chat.id}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {chat.name}
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCloseChat(chat.id);
                      }}
                      sx={{ ml: 1 }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                }
              />
            ))}
          </Tabs>

          {/* Chat Content */}
          {activeTab === 'group-chat' ? <Chat /> : <PrivateChat selectedUser={activeTab} />}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
