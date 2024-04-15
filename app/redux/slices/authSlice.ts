import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { loginRequest, logoutRequest, checkTokenValidity, fetchUserData, getRefreshToken, refreshToken } from '../../utils/auth';
import { LoginData, Artist } from '../../types';
import { RootState } from '../store';

export interface AuthState {
  user: { username: string } | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: true,
  error: null,
};

export const checkAuthStatus = createAsyncThunk('auth/checkAuthStatus', async (_, { getState, dispatch, rejectWithValue }) => {
  try {
    const state = getState() as RootState;
    const { user } = state.auth;

    if (!user) {
      const isValidToken = await checkTokenValidity();

      if (isValidToken) {
        const userData = await fetchUserData();
        console.log(userData);
        dispatch(authActions.updateUserData(userData));
        return userData;
      } else {
        // Attempt token refresh if refreshToken is available
        const refreshTokenValue = getRefreshToken();
        if (refreshTokenValue) {
          try {
            console.log("HELLA")
            console.log(refreshTokenValue)
            const response = await refreshToken(refreshTokenValue);
            console.log("response: ", response)
            // Update tokens in local storage
            if (response.access) {
              localStorage.setItem('accessToken', response.access);
              localStorage.setItem('refreshToken', response.refresh);
              // Retry fetching user data after token refresh
              const userData = await fetchUserData();
              console.log(userData);
              dispatch(authActions.updateUserData(userData));
              return userData;
            }
            else{
              throw new Error('No token received');
            }
          } catch (refreshError: any) {
            console.error('Token refresh error:', refreshError.message);
            throw new Error('Error refreshing token');
          }
        } else {
          throw new Error('No refresh token available');
        }
      }
    }

    return user;
  } catch (error: unknown) {
    console.error('Error checking authentication status:', error);
    return rejectWithValue('Error checking authentication status');
  }
});

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (loginData: LoginData) => {
    try {
      const data = await loginRequest(loginData);
      return data.user;
    } catch (error: unknown) {
      if (typeof error === 'string') {
        throw new Error(error || 'Login failed');
      } else {
        throw new Error('An unknown error occurred during login');
      }
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async () => {
    try {
      await logoutRequest();
      return null;
    } catch (error: unknown) {
      if (typeof error === 'string') {
        throw new Error(error || 'Logout failed');
      } else {
        throw new Error('An unknown error occurred during logout');
      }
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateUserData(state, action: PayloadAction<Artist | { username: string } | null>) {
      if (action.payload) {
        const username = 'username' in action.payload ? action.payload.username : action.payload;
        state.user = { username };
      } else {
        state.user = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Logout failed';
      })
      .addDefaultCase((state) => state);
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;