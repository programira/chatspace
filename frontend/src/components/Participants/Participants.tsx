import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, ListItemIcon, Avatar, ListItemButton,  } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Participant } from '../../types/Participant';
import { fetchParticipants } from '../../services/userService';
import { setParticipants } from '../../store/participantsSlice';
import { selectWebSocketState } from '../../store/webSocketSlice';
import { setSelectedUser } from '../../store/userSlice';

const Participants: React.FC = () => {
  const dispatch = useDispatch();
  const participants: Participant[] = useSelector((state: RootState) => state.participants.list); // Get participants from Redux
  const currentUser = useSelector((state: RootState) => state.user.currentUser); // Get the logged-in user
  const { isConnected } = useSelector(selectWebSocketState); 
   // State to track selected participant
   // const [selectedUserId, setSelectedUserId] = useState<string | null>(currentUser?.id || null);

  
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
  }, [dispatch, isConnected]);  

  const onSelectUser = (userId: string | null) => {
    dispatch(setSelectedUser(userId));
    console.log('Selected user:', userId);
  };

  

  return (
    <Box
      sx={{
        flex: 1,
        padding: 2,
        backgroundColor: '#e0e0e0',
        borderRadius: 1,
        color: '#000',
        // overflowY: 'auto', // Enable scrolling if the list is long
        height: '97%', // Make sure it takes full height
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Title with Participant Count */}
      <Typography variant="h6">
        Participants ({participants.length})
      </Typography>

      {/* Participants List */}
      <List
      component="nav"
      sx={{
        flexGrow: 1,
        overflowY: 'auto', // Enables scrolling
        maxHeight: 'calc(100vh - 150px)', // Adjust this value as needed
      }}
      >
        {participants.map(participant => (
          <ListItemButton
            key={participant.id}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
             padding: '8px 0',
              // cursor: 'pointer',
            }}
            onClick={() => onSelectUser(participant.userId === currentUser?.id ? null : participant.userId)}
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
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
};

export default Participants;
