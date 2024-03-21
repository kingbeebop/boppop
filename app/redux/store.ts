import { configureStore } from '@reduxjs/toolkit';
import playlistReducer from './slices/playlistSlice';
import authReducer, { AuthState } from './slices/authSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    playlists: playlistReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
