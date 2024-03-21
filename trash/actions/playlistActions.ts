import { Dispatch } from 'redux';
import { fetchPlaylist } from '../../utils/api';
import { AppDispatch, RootState } from '../store';
import { createAsyncThunk } from '@reduxjs/toolkit';

// Define action types
export const FETCH_PLAYLIST_REQUEST = 'FETCH_PLAYLIST_REQUEST';
export const FETCH_PLAYLIST_SUCCESS = 'FETCH_PLAYLIST_SUCCESS';
export const FETCH_PLAYLIST_FAILURE = 'FETCH_PLAYLIST_FAILURE';

// Define action creators
export const fetchPlaylistRequest = () => ({
  type: FETCH_PLAYLIST_REQUEST as typeof FETCH_PLAYLIST_REQUEST,
});

export const fetchPlaylistSuccess = (playlist: any) => ({
  type: FETCH_PLAYLIST_SUCCESS as typeof FETCH_PLAYLIST_SUCCESS,
  payload: playlist,
});

export const fetchPlaylistFailure = (error: string) => ({
  type: FETCH_PLAYLIST_FAILURE as typeof FETCH_PLAYLIST_FAILURE,
  payload: error,
});

export const fetchPlaylistAsync = createAsyncThunk(
  'playlists/fetchPlaylist',
  async (id: number, thunkAPI) => {
    try {
      const response = await fetchPlaylist(id);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
// // Async action creator
// export const fetchPlaylistAsync = (playlistId: string) => {
//   return async (dispatch: AppDispatch, getState: () => RootState): Promise<void> => {
//     const { playlists } = getState().playlists;

//     // Check if the playlist with the given ID already exists in the store
//     const existingPlaylist = playlists.find((playlist) => playlist.id === playlistId);

//     if (existingPlaylist) {
//       return; // Playlist already exists, no need to fetch again
//     }

//     // Playlist doesn't exist, fetch it from the API
//     dispatch(fetchPlaylistRequest());
//     try {
//       const data = await fetchPlaylist(playlistId);
//       dispatch(fetchPlaylistSuccess(data));
//     } catch (error: any) {
//       dispatch(fetchPlaylistFailure(error.message));
//     }
//   };
// };