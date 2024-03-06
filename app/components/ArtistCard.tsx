// components/ArtistCard.tsx
import React from 'react';
import Link from 'next/link';

interface ArtistCardProps {
  id: string;
  name: string;
}

const ArtistCard: React.FC<ArtistCardProps> = ({ id, name }) => {
  return (
    <Link href={`/artists/${encodeURIComponent(name)}`}>
      <div>
        <p>{name}</p>
      </div>
    </Link>
  );
};

export default ArtistCard;
