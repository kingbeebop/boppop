import { SELECT_SONG } from '../actions/selectedSongActions';
import { Song } from '../../types';

interface SelectedSongState {
  selectedSong: Song | null;
}

const initialState: SelectedSongState = {
  selectedSong: null,
};

const selectedSongReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SET_SELECTED_SONG:
      return { ...state, selectedSong: action.payload };
    default:
      return state;
  }
};

export default selectedSongReducer;
