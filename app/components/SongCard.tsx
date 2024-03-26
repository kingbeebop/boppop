import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { setSelectedSong } from '../redux/slices/songSlice';
import { Song } from '../types';

interface SongCardProps {
  song: Song;
}

const SongCard: React.FC<SongCardProps> = ({ song }) => {
  const dispatch = useDispatch();
  const selectedSong = useSelector((state: RootState) => state.song.selectedSong);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    dispatch(setSelectedSong(song));
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const isSelected = selectedSong?.id === song.id;

  return (
    <div
      className={`p-3 border rounded cursor-pointer ${isSelected ? 'bg-green-500' : ''}`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="font-bold mb-1">{song.title}</div>
      <div className={`${isHovered ? 'ml-4 transition-all duration-500' : ''}`}>
        by {song.artist}
      </div>
    </div>
  );
};

export default SongCard;
