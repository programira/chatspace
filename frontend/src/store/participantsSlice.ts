import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Participant } from '../types/Participant';

interface ParticipantsState {
  list: Participant[];
}

const initialState: ParticipantsState = {
  list: [],
};

const participantsSlice = createSlice({
  name: 'participants',
  initialState,
  reducers: {
    setParticipants: (state, action: PayloadAction<Participant[]>) => {
      state.list = action.payload;
    },
    addParticipant: (state, action: PayloadAction<Participant>) => {
      state.list.push(action.payload);
    },
    removeParticipant: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter(p => p.id !== action.payload);
    },
  },
});

export const { setParticipants, addParticipant, removeParticipant } = participantsSlice.actions;

export default participantsSlice.reducer;
