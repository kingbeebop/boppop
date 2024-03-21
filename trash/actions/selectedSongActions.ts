import { Action } from 'redux';
import { Song } from '../../types';

// Define action types
export const SELECT_SONG = 'SELECT_SONG';

// Define action interfaces
interface SelectSongAction extends Action<typeof SELECT_SONG> {
  song: Song;
}

// Action creators
export const selectSong = (song: Song): SelectSongAction => ({
  type: SELECT_SONG,
  song,
});
