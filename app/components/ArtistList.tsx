// components/ArtistList.tsx
import React from 'react';
import ArtistCard from './ArtistCard';

interface ArtistListProps {
  artists: { id: string; name: string }[];
}

const ArtistList: React.FC<ArtistListProps> = ({ artists }) => {
  return (
    <div>
      {artists.map((artist) => (
        <ArtistCard key={artist.id} id={artist.id} name={artist.name} />
      ))}
    </div>
  );
};

export default ArtistList;
