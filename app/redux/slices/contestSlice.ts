import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { getContest, postBallot } from '../../services/api'; // Update with your API functions
import { Ballot, Playlist } from '../../types';

interface ContestState {
  loading: boolean;
  error: string | null;
  playlist: Playlist | null; // Renamed from vote to playlist
  ballot: Ballot | null; // Updated to be nullable
}

const initialState: ContestState = {
  loading: false,
  error: null,
  playlist: null,
  ballot: { songId: null, comments: '' },
};

// Async thunk to fetch contest data
export const getContestData = createAsyncThunk('contest/fetchContestData', async () => {
  const response = await getContest(); // Call directly from API file
  return response;
});

// Async thunk to submit vote
export const submitBallot = createAsyncThunk('contest/submitBallot', async (_, { getState }) => {
  const state = getState() as RootState;
  const { ballot } = state.contest;

  if (ballot) {
    const response = await postBallot(ballot); // Submit the current ballot state
    return response;
  } else {
    // If ballot is null, do nothing and return null
    return null;
  }
});


const contestSlice = createSlice({
  name: 'contest',
  initialState,
  reducers: {
    setBallot(state, action) {
      state.ballot = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getContestData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getContestData.fulfilled, (state, action) => {
        state.loading = false;
        state.playlist = action.payload; // Updated to playlist from vote
      })
      .addCase(getContestData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch contest data';
      })
      .addCase(submitBallot.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitBallot.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // state.ballot = action.payload; // Update ballot with response data
      })
      .addCase(submitBallot.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to submit vote';
      });
  },
});

export const { setBallot } = contestSlice.actions;

export default contestSlice.reducer;

// Selector to get contest state
export const selectContest = (state: RootState) => state.contest;
