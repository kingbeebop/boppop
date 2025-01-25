import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getSubmission, submitOrUpdateSubmission } from '../../services/api'; // Import submitOrUpdateSubmission from utils/api
import { Song } from '../../types'; // Import Song type from types file

interface SubmissionData {
  title: string;
  url: string;
}

interface SubmissionState {
  song: Song | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: SubmissionState = {
  song: null,
  isLoading: false,
  error: null,
};

export const submitSubmission = createAsyncThunk(
  'submission/submitSubmission',
  async (formData: SubmissionData, { rejectWithValue }) => {
    try {
      await submitOrUpdateSubmission(formData);
      // Return the submitted data as a response
      return formData;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSubmissionData = createAsyncThunk(
  'submission/fetchSubmissionData',
  async () => {
    try {
      const response = await getSubmission();
      return response;
    } catch (error: any) {
      throw new Error('Error fetching submission data');
    }
  }
);

const submissionSlice = createSlice({
  name: 'submission',
  initialState,
  reducers: {
    fetchSubmissionStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    fetchSubmissionSuccess(state, action: PayloadAction<Song>) {
      state.song = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    fetchSubmissionFailure(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitSubmission.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(submitSubmission.fulfilled, (state, action: PayloadAction<SubmissionData>) => {
        // Assuming submitOrUpdateSubmission returns the Song object
        state.song = action.payload as Song; // Cast action.payload as Song
        state.isLoading = false;
        state.error = null;
      })
      .addCase(submitSubmission.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchSubmissionData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSubmissionData.fulfilled, (state, action: PayloadAction<Song | null>) => {
        state.song = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchSubmissionData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { fetchSubmissionStart, fetchSubmissionSuccess, fetchSubmissionFailure } = submissionSlice.actions;

export default submissionSlice.reducer;
