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
      <a>
        <div>
          <p>{name}</p>
        </div>
      </a>
    </Link>
  );
};

export default ArtistCard;