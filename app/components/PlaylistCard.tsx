// components/PlaylistCard.tsx
import React from 'react';
import Link from 'next/link';

interface PlaylistCardProps {
  id: string;
  theme: string;
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({ id, theme }) => {
  return (
    <Link href={`/playlist/${id}`}>
      <div>
        <p>{id} - {theme}</p>
      </div>
    </Link>
  );
};

export default PlaylistCard;
