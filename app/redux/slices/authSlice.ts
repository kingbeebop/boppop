import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { loginUser as loginUserApi, logoutUser as logoutUserApi, attemptTokenLogin } from '../../services/api';
import { Login, Artist } from '../../types';

export interface AuthState {
  user: { username: string } | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (data: Login) => {
    const response = await loginUserApi(data);
    return response.user;
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    await logoutUserApi();
  }
);

export const checkAuthStatus = createAsyncThunk(
  'auth/checkAuthStatus',
  async (_, { dispatch }) => {
    const user = await attemptTokenLogin();
    if (user) {
      dispatch(updateUserData(user));
    }
    return user;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateUserData: (state, action: PayloadAction<Artist>) => {
      state.user = { username: action.payload.username };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
      })
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Logout failed';
      })
      .addCase(checkAuthStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.user = { username: action.payload.username };
        }
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.loading = false;
        state.user = null;
      });
  },
});

export const { updateUserData } = authSlice.actions;
export default authSlice.reducer;