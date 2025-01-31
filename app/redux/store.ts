import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import playlistReducer from './slices/playlistSlice';
import authReducer from './slices/authSlice';
import songReducer from './slices/songSlice';
import challengeReducer from './slices/challengeSlice';
import submissionReducer from './slices/submissionSlice';
import contestReducer from './slices/contestSlice';
import artistReducer from './slices/artistSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    artists: artistReducer,
    playlists: playlistReducer,
    songs: songReducer,
    challenge: challengeReducer,
    submission: submissionReducer,
    contest: contestReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
