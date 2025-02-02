import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { fetchPlaylist, fetchPlaylists, GetPlaylistsParams } from '../../services/api';
import { Playlist } from '../../types';

interface PlaylistState {
  byId: Record<string, Playlist>;
  allIds: string[];
  loading: boolean;
  error: string | null;
  search: string;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  endCursor: string | null;
  startCursor: string | null;
  totalCount: number;
}

const initialState: PlaylistState = {
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

export const getPlaylists = createAsyncThunk(
  'playlists/getPlaylists',
  async (params: GetPlaylistsParams) => {
    return await fetchPlaylists(params);
  }
);

export const getPlaylist = createAsyncThunk(
  'playlists/getPlaylist',
  async (id: string) => {
    return await fetchPlaylist(id);
  }
);

// Single playlist fetch
export const getPlaylistById = createAsyncThunk(
  'playlists/getPlaylistById',
  async (id: string, { getState }) => {
    // First check the cache
    const state = getState() as RootState;
    const cachedPlaylist = state.playlists.byId[id];
    if (cachedPlaylist) {
      return cachedPlaylist;
    }

    // If not in cache, fetch from API
    const playlist = await fetchPlaylist(id);
    return playlist;
  }
);

const playlistSlice = createSlice({
  name: 'playlists',
  initialState,
  reducers: {
    setSearch: (state, action) => {
      state.search = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPlaylists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPlaylists.fulfilled, (state, action) => {
        if (!action.payload) {
          state.error = 'Invalid response format';
          state.loading = false;
          return;
        }

        state.loading = false;
        const { edges, pageInfo, totalCount } = action.payload;
        
        if (!action.meta.arg.after) {
          state.byId = {};
          state.allIds = [];
        }
        
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
      .addCase(getPlaylists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch playlists';
      })
      .addCase(getPlaylist.fulfilled, (state, action) => {
        if (action.payload) {
          state.byId[action.payload.id] = action.payload;
          if (!state.allIds.includes(action.payload.id)) {
            state.allIds.push(action.payload.id);
          }
        }
      })
      .addCase(getPlaylistById.fulfilled, (state, action) => {
        if (action.payload) {
          state.byId[action.payload.id] = action.payload;
          if (!state.allIds.includes(action.payload.id)) {
            state.allIds.push(action.payload.id);
          }
        }
      });
  },
});

export const { setSearch } = playlistSlice.actions;
export const selectPlaylists = (state: RootState) => state.playlists.allIds.map(id => state.playlists.byId[id]);
export const selectPlaylistsState = (state: RootState) => state.playlists;

export default playlistSlice.reducer;
