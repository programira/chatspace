import React from 'react';
import { Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import Login from './components/Login/Login';
import Layout from './components/Layout/Layout';

const App = () => {
  const { isLoggedIn, currentUser } = useSelector((state: RootState) => state.user); // Use Redux state for user
  const [theme, setTheme] = React.useState('light'); // Theme state

  return (
    <Box
      sx={{
        height: '100vh',
        backgroundColor: theme === 'light' ? '#f5f5f5' : '#303030',
        color: theme === 'light' ? '#000' : '#fff',
      }}
    >
      {/* Conditionally render either Login or Layout */}
      {!isLoggedIn ? (
        <Login onLogin={() => {}} /> 
      ) : (
        <Layout theme={theme} setTheme={setTheme} userName={currentUser?.name || ''} />
      )}
    </Box>
  );
};

export default App;
