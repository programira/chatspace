import React, { useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText, ListItemIcon, Avatar } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Participant } from '../../types/Participant';
import { fetchParticipants } from '../../services/userService';
import { setParticipants } from '../../store/participantsSlice';

const Participants: React.FC = () => {
  const dispatch = useDispatch();
  const participants: Participant[] = useSelector((state: RootState) => state.participants.list); // Get participants from Redux
  const currentUser = useSelector((state: RootState) => state.user.currentUser); // Get the logged-in user
  
  useEffect(() => {
    const loadParticipants = async () => {
      try {
        const data = await fetchParticipants();
        dispatch(setParticipants(data)); // Update Redux state with fetched participants
      } catch (error) {
        console.error('Error fetching participants:', error);
      }
    };

    loadParticipants();
  }, [dispatch]);  

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
        Participants ({participants.length})
      </Typography>

      {/* Participants List */}
      <List>
        {participants.map(participant => (
          <ListItem
            key={participant.id}
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
                {participant.user.name.charAt(0)} {/* Display first letter of the name */}
              </Avatar>
              <ListItemText
                primary={participant.userId === currentUser?.id ? `${currentUser.name} (You)` : participant.user.name}
              />
            </Box>

            {/* Active Indicator */}
            <ListItemIcon sx={{ minWidth: 'unset' }}>
              <CircleIcon
                fontSize="small"
                sx={{
                  color: participant.isActive ? 'green' : 'grey', // Green for active, grey otherwise
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
