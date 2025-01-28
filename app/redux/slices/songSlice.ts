import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { getSong, getSongsByIds } from '../../services/api';
import { Song } from '../../types';

interface SongState {
  byId: Record<string, Song>;
  allIds: string[];
  selectedSongId: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: SongState = {
  byId: {},
  allIds: [],
  selectedSongId: null,
  loading: false,
  error: null,
};

export const fetchSong = createAsyncThunk(
  'songs/fetchSong',
  async (id: string) => {
    return await getSong(id);
  }
);

export const fetchSongs = createAsyncThunk(
  'songs/fetchSongs',
  async (ids: string[]) => {
    return await getSongsByIds(ids);
  }
);

const songSlice = createSlice({
  name: 'songs',
  initialState,
  reducers: {
    setSelectedSong: (state, action) => {
      state.selectedSongId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSong.fulfilled, (state, action) => {
        if (action.payload) {
          state.byId[action.payload.id] = action.payload;
          if (!state.allIds.includes(action.payload.id)) {
            state.allIds.push(action.payload.id);
          }
        }
      })
      .addCase(fetchSongs.fulfilled, (state, action) => {
        action.payload.forEach(song => {
          state.byId[song.id] = song;
          if (!state.allIds.includes(song.id)) {
            state.allIds.push(song.id);
          }
        });
      });
  },
});

export const { setSelectedSong } = songSlice.actions;
export const selectSongs = (state: RootState) => state.songs.allIds.map(id => state.songs.byId[id]);
export const selectSongsState = (state: RootState) => state.songs;

export default songSlice.reducer;
