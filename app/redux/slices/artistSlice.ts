import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { getArtist, getArtists } from '../../services/api';
import { Artist, ArtistResponse } from '../../types';

interface ArtistState {
  artists: Artist[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  limit: number;
  search: string;
}

const initialState: ArtistState = {
  artists: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 0,
  totalItems: 0,
  limit: 10,
  search: '',
};

export const fetchArtist = createAsyncThunk(
  'artists/fetchArtist',
  async (id: number) => {
    try {
      const response = await getArtist(id);
      return response; // Return the fetched artist
    } catch (error) {
      throw new Error('Failed to fetch artist');
    }
  }
);

export const fetchArtists = createAsyncThunk(
  'artists/fetchArtists',
  async ({ limit, page, search }: { limit?: number; page?: number; search?: string }) => {
    try {
      const response = await getArtists({ limit: limit || 10, page: page || 1, search: search || '' });
      return response; // Assuming API response has a 'results' property containing artists
    } catch (error) {
      throw new Error('Failed to fetch artists');
    }
  }
);

const artistSlice = createSlice({
  name: 'artists',
  initialState,
  reducers: {
    // Add reducer logic if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchArtists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArtists.fulfilled, (state, action: PayloadAction<ArtistResponse>) => {
        state.loading = false;
        state.error = null;
        state.artists = action.payload.items;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
        state.totalItems = action.payload.totalItems;
      })
      .addCase(fetchArtists.rejected, (state, action) => {
        state.loading = false;
        state.error = 'Failed to fetch artists';
      })
      .addCase(fetchArtist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArtist.fulfilled, (state, action: PayloadAction<Artist>) => {
        state.loading = false;
        state.error = null;
        state.artists.push(action.payload); // Add the fetched artist to state
      })
      .addCase(fetchArtist.rejected, (state, action) => {
        state.loading = false;
        state.error = 'Failed to fetch artist';
      });
  },
});

export const selectArtist = (state: RootState) => state.artist;

export const { reducer: artistReducer } = artistSlice;
export default artistReducer;
