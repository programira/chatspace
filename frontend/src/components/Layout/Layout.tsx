import React from 'react';
import { Box } from '@mui/material';
import Header from '../Header/Header';
import Participants from '../Participants/Participants';
import Chat from '../Chat/Chat';

interface LayoutProps {
  theme: string;
  setTheme: (theme: string) => void;
  userName: string;
}

const Layout: React.FC<LayoutProps> = ({ theme, setTheme, userName }) => {
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

        {/* Chat Section */}
        <Chat />
      </Box>
    </Box>
  );
};

export default Layout;
