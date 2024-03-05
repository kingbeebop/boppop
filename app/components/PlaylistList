// components/PlaylistList.tsx
import React from 'react';
import PlaylistCard from './PlaylistCard';

interface PlaylistListProps {
  playlists: { id: string; theme: string }[];
}

const PlaylistList: React.FC<PlaylistListProps> = ({ playlists }) => {
  return (
    <div>
      {playlists.map((playlist) => (
        <PlaylistCard key={playlist.id} id={playlist.id} theme={playlist.theme} />
      ))}
    </div>
  );
};

export default PlaylistList;
