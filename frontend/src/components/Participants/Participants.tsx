import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, ListItemIcon, Avatar } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Participant } from '../../types/Participant';

const Participants: React.FC = () => {
  const participants: Participant[] = useSelector((state: RootState) => state.participants.list); // Get participants from Redux
  const currentUser = useSelector((state: RootState) => state.user.currentUser); // Get the logged-in user

  // Include the current user in the participants list if not already present
  const allParticipants = currentUser
    ? [currentUser, ...participants.filter(p => p.id !== currentUser.id)]
    : participants;

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
        Participants ({allParticipants.length})
      </Typography>

      {/* Participants List */}
      <List>
        {allParticipants.map(user => (
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
              <ListItemText
                primary={user.id === currentUser?.id ? `${user.name} (You)` : user.name}
              />
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
