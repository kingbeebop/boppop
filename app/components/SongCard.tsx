import React from 'react';
import { Song } from '../types'

interface SongCardProps {
  song: Song;
  onSelect: (song: Song) => void; // Ensure onSelect prop is correctly defined
}

const SongCard: React.FC<SongCardProps> = ({ song, onSelect }) => {
  const handleClick = () => {
    onSelect(song); // Use onSelect prop to handle song selection
  };

  return (
    <div onClick={handleClick}>
      <div>
        {song.title} by {song.artist}
      </div>
    </div>
  );
};

export default SongCard;