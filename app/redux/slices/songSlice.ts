import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { fetchSong, fetchSongs } from '../../services/api';
import { Song } from '../../types';

interface SongState {
  byId: Record<string, Song>;
  allIds: string[];
  selectedSong: Song | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: SongState = {
  byId: {},
  allIds: [],
  selectedSong: null,
  status: 'idle',
  error: null,
};

export const getSongs = createAsyncThunk(
  'songs/getSongs',
  async (songIds: string[], { getState }) => {
    const state = getState() as RootState;
    
    // Filter out IDs we already have in cache
    const missingIds = songIds.filter(id => !state.songs.byId[id]);
    
    if (missingIds.length === 0) {
      console.log('All songs already in cache');
      return [];
    }

    console.log('Fetching missing songs:', missingIds);
    const songs = await fetchSongs(missingIds);
    return songs;
  }
);

export const getSong = createAsyncThunk(
  'songs/getSong',
  async (id: string, { getState }) => {
    const state = getState() as RootState;
    
    // Check if we already have this song in cache
    if (state.songs.byId[id]) {
      console.log('Song already in cache:', id);
      return null;
    }

    console.log('Fetching song:', id);
    return await fetchSong(id);
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
    },
    clearSongs: (state) => {
      state.byId = {};
      state.allIds = [];
      state.selectedSong = null;
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSongs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getSongs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Add new songs to cache without removing existing ones
        action.payload.forEach((song: Song) => {
          state.byId[song.id] = song;
        });
      })
      .addCase(getSongs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch songs';
      })
      // Add cases for getSong
      .addCase(getSong.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getSong.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Only update if we got a new song (not null from cache)
        if (action.payload) {
          state.byId[action.payload.id] = action.payload;
          if (!state.allIds.includes(action.payload.id)) {
            state.allIds.push(action.payload.id);
          }
        }
      })
      .addCase(getSong.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch song';
      });
  },
});

export const { 
  setSelectedSong, 
  addSong, 
  updateSong, 
  removeSong,
  clearSongs 
} = songSlice.actions;

// Selectors
export const selectSongs = (state: RootState) => 
  state.songs.allIds.map(id => state.songs.byId[id]);

export const selectSongById = (state: RootState, id: string) => state.songs.byId[id];

export const selectSongsByIds = (state: RootState, ids: string[]) => 
  ids.map(id => state.songs.byId[id]).filter(Boolean);

export const selectSongsState = (state: RootState) => state.songs;

export default songSlice.reducer;
