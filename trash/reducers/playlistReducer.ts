import { FETCH_PLAYLIST_REQUEST, FETCH_PLAYLIST_SUCCESS, FETCH_PLAYLIST_FAILURE } from '../actions/playlistActions';

interface PlaylistState {
  playlists: any[]; // Update with actual playlist type
  loading: boolean;
  error: string | null;
}

const initialState: PlaylistState = {
  playlists: [],
  loading: false,
  error: null,
};

const playlistReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case FETCH_PLAYLIST_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_PLAYLIST_SUCCESS:
      return { ...state, playlists: [action.payload], loading: false, error: null }; // Update playlists with fetched data
    case FETCH_PLAYLIST_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default playlistReducer;
