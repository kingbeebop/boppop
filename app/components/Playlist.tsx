import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { fetchPlaylistAsync, selectPlaylistById } from '../redux/slices/playlistSlice'; // Assuming correct import path
import SongCard from './SongCard'; // Assuming correct import path for SongCard component
import { Song, Playlist as PlaylistType } from '../types';

interface PlaylistProps {
  id: number;
}

const Playlist: React.FC<PlaylistProps> = ({ id }) => {
  const dispatch = useDispatch<any>();
  const { loading, error, playlists } = useSelector((state: RootState) => state.playlists);
  const playlist = useSelector((state: RootState) => selectPlaylistById(state, id));

  useEffect(() => {
    if (!playlist) {
      dispatch(fetchPlaylistAsync(id));
    }
  }, [dispatch, id, playlist]);

  const handleSelect = (song: Song) => {
    console.log('SELECTED SONG: ', song.title);
  };

  useEffect(() => {
    console.log('Playlists:', playlists);
    console.log('Playlist:', playlist);
  }, [playlist, playlists])
  

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="playlist-container">
      <h2>{playlist?.theme}</h2>
      {playlist?.songs.map((song: Song) => (
        <SongCard
          key={song.id}
          onSelect={() => handleSelect(song)}
          song={song}
        />
      ))}
    </div>
  );
};

export default Playlist;
