import React, { useState } from 'react';
import { Box } from '@mui/material';
import Login from './components/Login/Login';
import Layout from './components/Layout/Layout';

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false); // State to toggle screens
  const [theme, setTheme] = useState('light'); // Theme state
  const [userName, setUserName] = useState(''); // Store username from Login

  return (
    <Box
      sx={{
        height: '100vh',
        backgroundColor: theme === 'light' ? '#f5f5f5' : '#303030',
        color: theme === 'light' ? '#000' : '#fff',
      }}
    >
      {/* Conditionally render either Login or Layout */}
      {!loggedIn ? (
        <Login
          onLogin={(name: string) => {
            setUserName(name); // Capture username
            setLoggedIn(true);
          }}
        />
      ) : (
        <Layout theme={theme} setTheme={setTheme} userName={userName} />
      )}
    </Box>
  );
};

export default App;
