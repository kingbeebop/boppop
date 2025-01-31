import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Artist, Playlist } from '../../types';
import { getChallenge } from '../../services/api';

interface ChallengeState {
  contest: boolean;
  theme: string | null;
  number: number | null;
  winner: Artist | null;
  playlist_id: string | null;
  songIds: string[];
  date: string | null;
  active: boolean;
  createdAt: string | null;
  updatedAt: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ChallengeState = {
  contest: false,
  theme: null,
  number: null,
  winner: null,
  playlist_id: null,
  songIds: [],
  date: null,
  active: false,
  createdAt: null,
  updatedAt: null,
  status: 'idle',
  error: null,
};

export const fetchChallenge = createAsyncThunk(
  'challenge/fetchChallenge',
  async () => {
    try {
      console.log('Fetching challenge...');
      const response = await getChallenge();
      console.log('Challenge response:', response);
      return response;
    } catch (error) {
      console.error('Challenge fetch error:', error);
      throw new Error('Failed to fetch challenge data');
    }
  }
);

const challengeSlice = createSlice({
  name: 'challenge',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchChallenge.pending, (state) => {
        console.log('Challenge fetch pending');
        state.status = 'loading';
      })
      .addCase(fetchChallenge.fulfilled, (state, action: PayloadAction<Playlist>) => {
        console.log('Challenge fetch fulfilled:', action.payload);
        state.status = 'succeeded';
        state.contest = action.payload.contest;
        state.theme = action.payload.theme;
        state.number = action.payload.number;
        state.playlist_id = action.payload.id;
        state.songIds = action.payload.songIds;
        state.date = action.payload.date;
        state.active = action.payload.active;
        state.createdAt = action.payload.createdAt;
        state.updatedAt = action.payload.updatedAt;
      })
      .addCase(fetchChallenge.rejected, (state) => {
        console.log('Challenge fetch rejected');
        state.status = 'failed';
        state.error = 'Failed to fetch challenge data';
      });
  },
});

export const selectChallenge = (state: RootState) => state.challenge;

export default challengeSlice.reducer;
