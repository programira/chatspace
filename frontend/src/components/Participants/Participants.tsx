import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, ListItemIcon, Avatar } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle'; // For active status indicator

const mockParticipants = [
  { id: 1, name: 'Alice', isActive: true },
  { id: 2, name: 'Bob', isActive: false },
  { id: 3, name: 'Charlie', isActive: true },
  { id: 4, name: 'Diana', isActive: true },
]; // Replace this later with real data

const Participants: React.FC = () => {
  const activeParticipants = mockParticipants.filter(user => user.isActive);

  return (
    <Box
      sx={{
        flex: 1,
        padding: 2,
        backgroundColor: '#e0e0e0',
        borderRadius: 1,
        color: '#000',
        overflowY: 'auto', // Enable scrolling if the list is long
      }}
    >
      {/* Title with Participant Count */}
      <Typography variant="h6">
        Participants ({mockParticipants.length})
      </Typography>

      {/* Participants List */}
      <List>
        {mockParticipants.map(user => (
          <ListItem
            key={user.id}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 0',
            }}
          >
            {/* User Name */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ width: 30, height: 30 }}>
                {user.name.charAt(0)} {/* Display first letter of the name */}
              </Avatar>
              <ListItemText primary={user.name} />
            </Box>

            {/* Active Indicator */}
            <ListItemIcon sx={{ minWidth: 'unset' }}>
              <CircleIcon
                fontSize="small"
                sx={{
                  color: user.isActive ? 'green' : 'grey', // Green for active, grey otherwise
                }}
              />
            </ListItemIcon>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Participants;
