import React from 'react';
import { Box, Typography, Select, MenuItem, FormControl, InputLabel, OutlinedInput, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { clearUser } from '../../store/userSlice';
import { AppDispatch, RootState } from '../../store';
import { logoutUser } from '../../services/userService';
import { WS_URL } from '../../config/constants';
import useWebSocket from '../../hooks/useWebSocket';

interface HeaderProps {
  theme: string;
  setTheme: (theme: string) => void;
}

const Header: React.FC<HeaderProps> = ({ theme, setTheme }) => {

  const dispatch = useDispatch<AppDispatch>();
  // Retrieve the current user from the Redux store
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const { sendMessage } = useWebSocket(WS_URL);

  console.log(currentUser);
  
  const handleLogout = async () => {

  if (!currentUser?.id) {
    console.warn('No user is currently logged in.');
    return;
  }
  
    try {
      // Call the logout service
      await logoutUser(currentUser.id);
  
      // Clear user from Redux store
      dispatch(clearUser());
  
      // Optionally, you can add a WebSocket message to notify others
      sendMessage({
        type: 'userLoggedOut',
        userId: currentUser.id,
        userName: currentUser.name,
      });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 2,
        background: 'linear-gradient(90deg, #8e44ad, #000000)', // Purple to pink gradient
        color: '#fff', // White text for better contrast
      }}
    >
      {/* App Title */}
      <Typography variant="h6">ChatSpace - Status Meeting Standup</Typography>

      {/* Right section: Theme selector and Logout button */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2, // Space between Theme Selector and Logout Button
        }}
      >
        {/* Theme Selector */}
        <FormControl
          size="small"
          sx={{
            minWidth: 120,
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#fff', // Ensures border color is white
            },
            '& .MuiSvgIcon-root': {
              color: '#fff', // Dropdown arrow color
            },
          }}
        >
          {/* InputLabel styled for white color */}
          <InputLabel
            htmlFor="theme-select"
            sx={{
              color: '#fff', // Set the label color to white
            }}
          >
            Theme
          </InputLabel>
          <Select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            input={<OutlinedInput label="Theme" id="theme-select" />}
            sx={{
              color: '#fff', // Dropdown text color
            }}
          >
            <MenuItem value="light">Light</MenuItem>
            <MenuItem value="dark">Dark</MenuItem>
          </Select>
        </FormControl>

        {/* Logout Button */}
        <Button
          variant="contained"
          color="error"
          onClick={handleLogout}
          sx={{
            color: '#fff', // White text
            backgroundColor: '#e74c3c', // Red background
            '&:hover': {
              backgroundColor: '#c0392b', // Darker red on hover
            },
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
};

export default Header;
