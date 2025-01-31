import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getSubmission, submitOrUpdateSubmission } from '../../services/api'; // Import submitOrUpdateSubmission from utils/api
import { Song } from '../../types'; // Import Song type from types file

interface SubmissionData {
  title: string;
  url: string;
}

interface SubmissionState {
  song: Song | null;
  loading: boolean;
  error: string | null;
  form: {
    title: string;
    url: string;
  };
}

const initialState: SubmissionState = {
  song: null,
  loading: false,
  error: null,
  form: {
    title: '',
    url: '',
  },
};

export const submitSubmission = createAsyncThunk(
  'submission/submitSubmission',
  async (formData: SubmissionData, { rejectWithValue }) => {
    try {
      const response = await submitOrUpdateSubmission(formData);
      return response; // This should return a Song object from the API
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSubmissionData = createAsyncThunk(
  'submission/fetchSubmissionData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getSubmission();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const submissionSlice = createSlice({
  name: 'submission',
  initialState,
  reducers: {
    updateFormField: (state, action: PayloadAction<{ field: 'title' | 'url'; value: string }>) => {
      state.form[action.payload.field] = action.payload.value;
    },
    clearForm: (state) => {
      state.form = initialState.form;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitSubmission.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitSubmission.fulfilled, (state, action: PayloadAction<Song>) => {
        state.song = action.payload;
        state.loading = false;
        state.error = null;
        state.form = initialState.form; // Clear form on successful submission
      })
      .addCase(submitSubmission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchSubmissionData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubmissionData.fulfilled, (state, action: PayloadAction<Song | null>) => {
        state.song = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchSubmissionData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { updateFormField, clearForm } = submissionSlice.actions;

export default submissionSlice.reducer;
