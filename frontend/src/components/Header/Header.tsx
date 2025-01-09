import React from 'react';
import { Box, Typography, Select, MenuItem, FormControl, InputLabel, OutlinedInput } from '@mui/material';

interface HeaderProps {
  theme: string;
  setTheme: (theme: string) => void;
}

const Header: React.FC<HeaderProps> = ({ theme, setTheme }) => {
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
      <Typography variant="h6">ChatSpace - Status Meeting Standup</Typography>
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
          input={<OutlinedInput label="Theme" id="theme-select" />} // Ensure correct integration
          sx={{
            color: '#fff', // Dropdown text color
          }}
        >
          <MenuItem value="light">Light</MenuItem>
          <MenuItem value="dark">Dark</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default Header;
