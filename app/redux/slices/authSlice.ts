import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { loginUser, registerUser, logoutUser, getCurrentUser, initializeAuth } from '../../services/api/auth';
import type { User, Login, Registration } from '../../types';
import { fetchSubmissionData, clearSubmission } from './submissionSlice';
import { RootState } from '../store';

// Define and export the AuthState interface
export interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
  showLoginModal: boolean;
  showRegisterModal: boolean;
}

const initialState: AuthState = {
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  isAuthenticated: typeof window !== 'undefined' ? !!localStorage.getItem('token') : false,
  user: null,
  loading: false,
  error: null,
  showLoginModal: false,
  showRegisterModal: false,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: Login, { dispatch, rejectWithValue }) => {
    try {
      const authResponse = await loginUser(credentials);
      if (!authResponse.access_token) {
        return rejectWithValue('No access token received');
      }
      const userData = await getCurrentUser();
      dispatch(fetchSubmissionData());
      return {
        token: authResponse.access_token,
        user: userData
      };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Login failed');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData: Registration, { dispatch, rejectWithValue }) => {
    try {
      // First register the user
      await registerUser(userData);
      
      // Then attempt to login
      try {
        const loginResponse = await dispatch(login({
          username: userData.username,
          password: userData.password
        })).unwrap();
        
        return loginResponse;
      } catch (loginError) {
        console.error('Auto-login after registration failed:', loginError);
        return rejectWithValue('Registration successful but login failed. Please try logging in manually.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      return rejectWithValue(
        error instanceof Error ? error.message : 'Registration failed'
      );
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await logoutUser();
      dispatch(clearSubmission());
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
      }
      return null;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Logout failed');
    }
  }
);

export const initAuth = createAsyncThunk(
  'auth/init',
  async (_, { rejectWithValue }) => {
    try {
      const user = await initializeAuth();
      if (user) {
        return {
          token: localStorage.getItem('token'),
          user
        };
      }
      return null;
    } catch (error) {
      console.error('Auth initialization error:', error);
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to initialize auth'
      );
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ token: string }>) => {
      const { token } = action.payload;
      state.token = token;
      state.isAuthenticated = true;
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
      }
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    clearUser: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.user = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    openLoginModal: (state) => {
      console.log('Opening login modal, auth state:', state.isAuthenticated);
      if (!state.isAuthenticated) {
        state.showLoginModal = true;
        state.showRegisterModal = false;
      }
    },
    closeLoginModal: (state) => {
      state.showLoginModal = false;
    },
    openRegisterModal: (state) => {
      if (!state.isAuthenticated) {
        state.showRegisterModal = true;
        state.showLoginModal = false;
      }
    },
    closeRegisterModal: (state) => {
      state.showRegisterModal = false;
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.loading = false;
      state.error = null;
    },
    setShowLoginModal: (state, action: PayloadAction<boolean>) => {
      state.showLoginModal = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.error = null;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Login failed';
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Registration failed';
      })
      // Logout
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
        state.showLoginModal = false;
        state.showRegisterModal = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Logout failed';
      })
      // Init Auth
      .addCase(initAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initAuth.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.token = action.payload.token;
          state.user = action.payload.user;
          state.isAuthenticated = true;
        } else {
          state.token = null;
          state.user = null;
          state.isAuthenticated = false;
        }
      })
      .addCase(initAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const {
  clearError,
  openLoginModal,
  closeLoginModal,
  openRegisterModal,
  closeRegisterModal,
  loginSuccess,
  setCredentials,
  setUser,
  clearUser,
  setShowLoginModal,
  setLoading,
  setError,
} = authSlice.actions;

export const selectCurrentToken = (state: RootState) => state.auth.token;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectUser = (state: RootState) => state.auth.user;

export default authSlice.reducer;