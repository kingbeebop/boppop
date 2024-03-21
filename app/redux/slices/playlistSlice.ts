import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { fetchPlaylist } from '../../utils/api';
import { Playlist } from '../../types';

interface PlaylistState {
  playlists: Playlist[];
  loading: boolean;
  error: string | null;
}

const initialState: PlaylistState = {
  playlists: [],
  loading: false,
  error: null,
};

export const fetchPlaylistAsync = createAsyncThunk(
  'playlists/fetchPlaylist',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await fetchPlaylist(id);
      console.log(response)
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const playlistSlice = createSlice({
  name: 'playlists',
  initialState,
  reducers: {
    // Add reducer logic if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlaylistAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlaylistAsync.fulfilled, (state, action: PayloadAction<Playlist>) => {
        state.loading = false;
        state.error = null;
        state.playlists.push(action.payload);
      })
      .addCase(fetchPlaylistAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const selectPlaylistById = (state: RootState, id: number) => {
  const { playlists } = state.playlists;
  return playlists.find((playlist) => playlist.id === id);
};

export const { reducer: playlistReducer } = playlistSlice;
export default playlistReducer;
