import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { getPlaylist, getPlaylists } from '../../services/api';
import { Playlist, PlaylistResponse } from '../../types';

interface PlaylistState {
  playlists: Playlist[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  count: number;
  totalItems: number;
  limit: number;
  search: string;
}

const initialState: PlaylistState = {
  playlists: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 0,
  count: 0,
  totalItems: 0,
  limit: 10,
  search: '',
};

export const fetchPlaylist = createAsyncThunk(
  'playlists/fetchPlaylist',
  async (id: number) => {
    const response = await getPlaylist(id);
    return response;
  }
);

export const fetchPlaylists = createAsyncThunk(
  'playlists/fetchPlaylists',
  async ({ limit, page, search }: { limit?: number; page?: number; search?: string }) => {
    const response = await getPlaylists({ limit, page, search });
    return response;
  }
);

const playlistSlice = createSlice({
  name: 'playlists',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlaylists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlaylists.fulfilled, (state, action: PayloadAction<PlaylistResponse>) => {
        state.loading = false;
        state.error = null;
        state.playlists = action.payload.items;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
        state.totalItems = action.payload.totalItems;
      })
      .addCase(fetchPlaylists.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to fetch playlists';
      });
  },
});

export const selectPlaylists = (state: RootState) => state.playlists;

export const { reducer: playlistReducer } = playlistSlice;
export default playlistReducer;
