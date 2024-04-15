// components/PlaylistList.tsx
import React from 'react';
import PlaylistCard from './PlaylistCard';
import { Playlist } from '../types';

const PlaylistList: React.FC<{ playlists: Playlist[] }> = ({ playlists }) => {
  return (
    <div>
      {playlists.map((playlist) => (
        <PlaylistCard key={playlist.id} playlist={playlist} />
      ))}
    </div>
  );
};

export default PlaylistList;
