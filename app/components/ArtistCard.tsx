// components/ArtistCard.tsx
import React from 'react';
import Link from 'next/link';
import { Artist } from '../types'

const ArtistCard: React.FC<{ artist: Artist }> = ({ artist }) => {

  console.log(artist)

  return (
    <Link href={`/artists/${encodeURIComponent(artist.id)}`}>
      <div className="hover-effect">
        <p>{artist.name}</p>
      </div>
    </Link>
  );
};

export default ArtistCard;