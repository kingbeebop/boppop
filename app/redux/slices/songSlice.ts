import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { getSongsByIds } from '../../services/api/song';
import { Song } from '../../types';

interface SongState {
  byId: Record<string, Song>;
  allIds: string[];
  selectedSong: Song | null;
  loading: boolean;
  error: string | null;
}

const initialState: SongState = {
  byId: {},
  allIds: [],
  selectedSong: null,
  loading: false,
  error: null,
};

export const fetchSongsByIds = createAsyncThunk(
  'songs/fetchSongsByIds',
  async (ids: string[]) => {
    const songs = await getSongsByIds(ids);
    console.log("Fetched songs:", songs);
    return songs;
  }
);

const songSlice = createSlice({
  name: 'songs',
  initialState,
  reducers: {
    setSelectedSong: (state, action) => {
      state.selectedSong = state.byId[action.payload];
    },
    addSong: (state, action: PayloadAction<Song>) => {
      const song = action.payload;
      // Only add if it's not already in the store or if it's different
      if (!state.byId[song.id] || 
          JSON.stringify(state.byId[song.id]) !== JSON.stringify(song)) {
        state.byId[song.id] = song;
        if (!state.allIds.includes(song.id)) {
          state.allIds.push(song.id);
        }
      }
    },
    updateSong: (state, action: PayloadAction<Partial<Song> & { id: string }>) => {
      const { id, ...updates } = action.payload;
      if (state.byId[id]) {
        state.byId[id] = { ...state.byId[id], ...updates };
      }
    },
    removeSong: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      delete state.byId[id];
      state.allIds = state.allIds.filter(songId => songId !== id);
      if (state.selectedSong?.id === id) {
        state.selectedSong = null;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSongsByIds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSongsByIds.fulfilled, (state, action) => {
        state.loading = false;
        action.payload.forEach(song => {
          state.byId[song.id] = song;
          if (!state.allIds.includes(song.id)) {
            state.allIds.push(song.id);
          }
        });
      })
      .addCase(fetchSongsByIds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch songs';
      });
  },
});

export const { 
  setSelectedSong, 
  addSong, 
  updateSong, 
  removeSong 
} = songSlice.actions;

// Selectors
export const selectSongs = (state: RootState) => 
  state.songs.allIds.map(id => state.songs.byId[id]);

export const selectSongById = (id: string) => (state: RootState) => 
  state.songs.byId[id];

export const selectSongsState = (state: RootState) => state.songs;

export default songSlice.reducer;
