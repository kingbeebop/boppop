import { configureStore } from '@reduxjs/toolkit';
import playlistReducer from './slices/playlistSlice';
import authReducer, { AuthState } from './slices/authSlice';
import songReducer from './slices/songSlice';
import challengeReducer from './slices/challengeSlice';
import submissionReducer from './slices/submissionSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    playlists: playlistReducer,
    song: songReducer,
    challenge: challengeReducer,
    submission: submissionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
