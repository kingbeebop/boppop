import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { fetchPlaylist, fetchPlaylists } from '../../utils/api';
import { Playlist } from '../../types';

interface PlaylistState {
  playlists: Playlist[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  limit: number;
  search: string;
  count: number; // Total count of playlists
}

const initialState: PlaylistState = {
  playlists: [],
  loading: false,
  error: null,
  currentPage: 1,
  limit: 10, // Default limit
  search: '',
  count: 0, // Initialize count to 0
};

export const fetchPlaylistAsync = createAsyncThunk(
  'playlists/fetchPlaylist',
  async (id: number, { getState }) => {
    const state = getState() as RootState;
    const existingPlaylist = state.playlists.playlists.find((playlist) => playlist.id === id);

    if (existingPlaylist) {
      return existingPlaylist;
    } else {
      try {
        const response = await fetchPlaylist(id);
        return response;
      } catch (error) {
        throw new Error('Failed to fetch playlist');
      }
    }
  }
);

export const fetchPlaylistsAsync = createAsyncThunk(
  'playlists/fetchPlaylists',
  async ({ limit, page, search }: { limit?: number; page?: number; search?: string }) => {
    try {
      const response = await fetchPlaylists(limit || 10, page || 1, search || '');
      return response;
    } catch (error) {
      throw new Error('Failed to fetch playlists');
    }
  }
);

const playlistSlice = createSlice({
  name: 'playlists',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlaylistsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlaylistsAsync.fulfilled, (state, action: PayloadAction<{ count: number; results: Playlist[] }>) => {
        state.loading = false;
        state.error = null;
        state.count = action.payload.count; // Update the count

        // Filter out playlists that already exist in the state
        const newPlaylists = action.payload.results.filter(
          (playlist) => !state.playlists.some((existingPlaylist) => existingPlaylist.id === playlist.id)
        );

        state.playlists.push(...newPlaylists);
        state.currentPage += 1;
      })
      .addCase(fetchPlaylistsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = 'Failed to fetch playlists';
      })
      .addCase(fetchPlaylistAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlaylistAsync.fulfilled, (state, action: PayloadAction<Playlist>) => {
        state.loading = false;
        state.error = null;

        // Check if the playlist already exists
        const exists = state.playlists.some((playlist) => playlist.id === action.payload.id);
        if (!exists) {
          state.playlists.push(action.payload);
        }
      })
      .addCase(fetchPlaylistAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = 'Failed to fetch playlist';
      });
  },
});

export const selectPlaylists = (state: RootState) => state.playlists;

export const { reducer: playlistReducer } = playlistSlice;
export default playlistReducer;
