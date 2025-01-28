import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { getArtist, getArtists, GetArtistsParams } from '../../services/api';
import { Artist } from '../../types';

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

export const fetchArtists = createAsyncThunk(
  'artists/fetchArtists',
  async (params: GetArtistsParams) => {
    return await getArtists(params);
  }
);

export const fetchArtist = createAsyncThunk(
  'artists/fetchArtist',
  async (id: number) => {
    const response = await getArtist(id);
    return response;
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
      .addCase(fetchArtists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArtists.fulfilled, (state, action) => {
        if (!action.payload?.artists) {
          state.error = 'Invalid response format';
          state.loading = false;
          return;
        }

        state.loading = false;
        const { edges, pageInfo, totalCount } = action.payload.artists;
        
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
      .addCase(fetchArtists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch artists';
      })
      .addCase(fetchArtist.fulfilled, (state, action) => {
        const artist = action.payload;
        state.byId[artist.id] = artist;
        if (!state.allIds.includes(artist.id)) {
          state.allIds.push(artist.id);
        }
      });
  },
});

export const { setSearch } = artistSlice.actions;
export const selectArtists = (state: RootState) => state.artists.allIds.map(id => state.artists.byId[id]);
export const selectArtistById = (state: RootState, id: string) => state.artists.byId[id];
export const selectArtistsState = (state: RootState) => state.artists;

export default artistSlice.reducer;
