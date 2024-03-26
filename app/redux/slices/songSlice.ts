import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Song } from '../../types';

interface SongState {
  selectedSong: Song | null;
}

const initialState: SongState = {
  selectedSong: null,
};

const songSlice = createSlice({
  name: 'songSlice',
  initialState,
  reducers: {
    setSelectedSong: (state, action: PayloadAction<Song>) => {
      state.selectedSong = action.payload;
    },
    clearSelectedSong: (state) => {
      state.selectedSong = null;
    },
  },
});

export const { setSelectedSong, clearSelectedSong } = songSlice.actions;

export default songSlice.reducer;
