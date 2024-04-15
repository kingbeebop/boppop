import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { fetchArtist, fetchArtists } from '../../utils/api';
import { Artist } from '../../types';

interface ArtistState {
  artists: Artist[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  limit: number;
  search: string;
  count: number; // Total count of artists
}

const initialState: ArtistState = {
  artists: [],
  loading: false,
  error: null,
  currentPage: 1,
  limit: 10,
  search: '',
  count: 0,
};

export const fetchArtistAsync = createAsyncThunk(
  'artists/fetchArtist',
  async (id: number) => {
    try {
      const response = await fetchArtist(id);
      return response; // Return the fetched artist
    } catch (error) {
      throw new Error('Failed to fetch artist');
    }
  }
);

export const fetchArtistsAsync = createAsyncThunk(
  'artists/fetchArtists',
  async ({ limit, page, search }: { limit?: number; page?: number; search?: string }) => {
    try {
      const response = await fetchArtists(limit || 10, page || 1, search || '');
      return response.results; // Assuming API response has a 'results' property containing artists
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
      .addCase(fetchArtistsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArtistsAsync.fulfilled, (state, action: PayloadAction<Artist[]>) => {
        state.loading = false;
        state.error = null;
        state.artists = action.payload; // Set artists directly instead of pushing
        state.currentPage = 1; // Reset current page to 1 after successful fetch
      })
      .addCase(fetchArtistsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = 'Failed to fetch artists';
      })
      .addCase(fetchArtistAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArtistAsync.fulfilled, (state, action: PayloadAction<Artist>) => {
        state.loading = false;
        state.error = null;
        state.artists.push(action.payload); // Add the fetched artist to state
      })
      .addCase(fetchArtistAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = 'Failed to fetch artist';
      });
  },
});

export const selectArtist = (state: RootState) => state.artist;

export const { reducer: artistReducer } = artistSlice;
export default artistReducer;
