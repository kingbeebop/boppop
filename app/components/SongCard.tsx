import React from 'react';

interface Song {
  id: string;
  name: string;
  artist: string;
}

interface SongCardProps {
  song: Song;
  onSelect: (song: Song) => void;
  currentPlayingId?: string | null;
  winner?: string;
}

const SongCard: React.FC<SongCardProps> = ({ song, onSelect, currentPlayingId, winner }) => {
  const handleClick = () => {
    onSelect(song);
  };

  const isActiveSong = currentPlayingId === song.id;
  const isWinningSong = winner === song.id;

  return (
    <div
      className={`${isActiveSong ? 'active-song' : ''} ${isWinningSong ? 'winning-song' : 'inactive-song'}`}
      onClick={handleClick}
    >
      <div>
        {song.name} by {song.artist}
      </div>
    </div>
  );
};

export default SongCard;