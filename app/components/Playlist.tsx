import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { fetchPlaylistAsync } from '../redux/slices/playlistSlice';
import SongCard from './SongCard';
import { Song } from '../types';

interface PlaylistProps {
  id: number;
}

const Playlist: React.FC<PlaylistProps> = ({ id }) => {
  const dispatch = useDispatch<any>();
  const { loading, error } = useSelector((state: RootState) => state.playlists);
  const playlist = useSelector((state: RootState) => state.playlists.playlists.find(p => p.id === id));

  useEffect(() => {
    if (!playlist) {
      dispatch(fetchPlaylistAsync(id));
    }
  }, [dispatch, id, playlist]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto mt-8">
      <div className="bg-gray-200 rounded-lg p-4">
        <h2 className="text-4xl font-bold mb-2">
          Bop Pop #{playlist?.number}
        </h2>
        <h3 className="text-2xl font-bold mb-4">
          {playlist?.theme}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {playlist?.songs.map((song: Song) => (
            <SongCard
              key={song.id}
              song={song}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Playlist;
