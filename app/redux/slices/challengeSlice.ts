import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Artist, Playlist } from '../../types'; // Import Artist type from types.ts
import { getChallenge } from '../../services/api'; // Import fetchChallengeData function from api.ts

interface ChallengeState {
  contest: boolean;
  theme: string | null;
  number: number | null;
  winner: Artist | null;
  playlist_id: number | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ChallengeState = {
  contest: false,
  theme: null,
  number: null,
  winner: null,
  playlist_id: null,
  status: 'idle',
  error: null,
};

export const fetchChallenge = createAsyncThunk('challenge/fetchChallenge', async () => {
  try {
    const response = await getChallenge(); // Call your fetch API function
    console.log(response)
    return response; // Assuming response.data contains the challenge data
  } catch (error) {
    throw new Error('Failed to fetch challenge data');
  }
});

const challengeSlice = createSlice({
  name: 'challenge',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchChallenge.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchChallenge.fulfilled, (state, action: PayloadAction<Playlist>) => {
        state.status = 'succeeded';
        state.contest = action.payload.contest;
        state.theme = action.payload.theme;
        state.number = action.payload.number;
        state.playlist_id = action.payload.id;
      })
      .addCase(fetchChallenge.rejected, (state) => {
        state.status = 'failed';
        state.error = 'Failed to fetch challenge data'; // Set error message directly
      });
      
  },
});

export const selectChallenge = (state: RootState) => state.challenge;

export default challengeSlice.reducer;
