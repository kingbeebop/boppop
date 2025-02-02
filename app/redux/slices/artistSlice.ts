import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { fetchArtist, fetchArtists } from '../../services/api';
import { Artist, GetArtistsParams } from '../../types';

interface ArtistState {
  // A lookup table of artists by their ID
  byId: Record<string, Artist>;  // e.g., { "1": { id: "1", name: "Test Artist", ... } }
  
  // An ordered array of artist IDs
  allIds: string[];              // e.g., ["1", "2", "3"]
  
  // UI and pagination state
  loading: boolean;
  error: string | null;
  search: string;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  endCursor: string | null;
  startCursor: string | null;
  totalCount: number;
}

const initialState: ArtistState = {
  byId: {},
  allIds: [],
  loading: false,
  error: null,
  search: '',
  hasNextPage: false,
  hasPreviousPage: false,
  endCursor: null,
  startCursor: null,
  totalCount: 0,
};

export const getArtists = createAsyncThunk(
  'artists/getArtists',
  async (params: GetArtistsParams) => {
    return await fetchArtists(params);
  }
);

export const getArtist = createAsyncThunk(
  'artists/getArtist',
  async (id: string) => {
    return await fetchArtist(id);
  }
);

const artistSlice = createSlice({
  name: 'artists',
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getArtists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getArtists.fulfilled, (state, action) => {
        if (!action.payload) {
          state.error = 'Invalid response format';
          state.loading = false;
          return;
        }

        state.loading = false;
        const { edges, pageInfo, totalCount } = action.payload;
        
        // Clear existing data when it's a new search
        if (!action.meta.arg.after) {
          state.byId = {};
          state.allIds = [];
        }
        
        // Add new items
        edges.forEach(({ node }) => {
          state.byId[node.id] = node;
          if (!state.allIds.includes(node.id)) {
            state.allIds.push(node.id);
          }
        });

        state.hasNextPage = pageInfo.hasNextPage;
        state.hasPreviousPage = pageInfo.hasPreviousPage;
        state.startCursor = pageInfo.startCursor;
        state.endCursor = pageInfo.endCursor;
        state.totalCount = totalCount;
      })
      .addCase(getArtists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch artists';
      })
      .addCase(getArtist.fulfilled, (state, action) => {
        const artist = action.payload;
        if (artist) {
          state.byId[artist.id] = artist;
          if (!state.allIds.includes(artist.id)) {
            state.allIds.push(artist.id);
          }
        }
      });
  },
});

export const { setSearch } = artistSlice.actions;
export const selectArtists = (state: RootState) => state.artists.allIds.map(id => state.artists.byId[id]);
export const selectArtistById = (state: RootState, id: string) => state.artists.byId[id];
export const selectArtistsState = (state: RootState) => state.artists;

export default artistSlice.reducer;
