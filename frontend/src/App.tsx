import React, { useEffect } from 'react';
import { Box, ThemeProvider, CssBaseline } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from './store';
import Login from './components/Login/Login';
import Layout from './components/Layout/Layout';
import { initializeWebSocket } from './store/webSocketSlice';
import { lightTheme, darkTheme } from './theme/theme'; 

const App = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoggedIn, currentUser } = useSelector((state: RootState) => state.user); // Use Redux state for user
  const [theme, setTheme] = React.useState('light'); // Theme state

  useEffect(() => {
    dispatch(initializeWebSocket());
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
    <Box
      sx={{
        height: '100vh',
        backgroundColor: (theme) => theme.palette.background.default, // ✅ Dynamic Theme Background
        color: (theme) => theme.palette.text.primary, // ✅ Dynamic Theme Text Color
      }}
    >
      {/* Conditionally render either Login or Layout */}
      {!isLoggedIn ? (
        <Login onLogin={() => {}} /> 
      ) : (
        <Layout theme={theme} setTheme={setTheme} userName={currentUser?.name || ''} />
      )}
    </Box>
    </ThemeProvider>
  );
};

export default App;
