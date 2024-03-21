import { combineReducers } from 'redux';
import playlistReducer from './playlistReducer';
import selectedSongReducer from './selectedSongReducer';
// Import other reducers as needed

const rootReducer = combineReducers({
  playlists: playlistReducer,
  selectedSong: selectedSongReducer,
  // Add other reducers here
});

export default rootReducer;
