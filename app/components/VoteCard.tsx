import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { setBallot } from '../redux/slices/contestSlice'; // Update to match your slice name and action
import { Song } from '../types';

interface VoteCardProps {
  song: Song;
  onRadialSelect: (song: Song) => void;
}

const VoteCard: React.FC<VoteCardProps> = ({ song, onRadialSelect }) => {
  const dispatch = useDispatch();
  const ballot = useSelector((state: RootState) => state.contest.ballot); // Update to match your slice name
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    dispatch(setBallot({ songId: song.id }));
  };

  const handleRadialSelect = () => {
    onRadialSelect(song);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      className={`p-3 border rounded cursor-pointer ${ballot?.songId === song.id ? 'bg-green-500' : ''}`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <input
        type="radio"
        name="vote"
        checked={ballot?.songId === song.id}
        onChange={handleRadialSelect}
      />
      <div className={`${isHovered ? 'ml-4 transition-all duration-500' : ''}`}>
        <strong>{song.title}</strong> by {song.artist}
      </div>
    </div>
  );
};

export default VoteCard;
