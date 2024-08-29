// components/PlaylistCard.tsx
import React from 'react';
import Link from 'next/link';
import { Playlist } from '../types';

const PlaylistCard: React.FC<{ playlist: Playlist }> = ({ playlist }) => {
  return (
    <Link href={`/playlist/${playlist.id}`}>
      <div className="hover-effect">
        <p>{playlist.id} - {playlist.theme}</p>
      </div>
    </Link>
  );
};

export default PlaylistCard;
