import React, { useState, useEffect } from 'react';
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
  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    setIsSelected(selectedSong?.id === song.id);
  }, [selectedSong]);

  useEffect(() => {
    if (selectedSong?.id === song.id){
      console.log("Dino Nuggets")
    }
  }, [isSelected])

  const handleClick = () => {
    dispatch(setSelectedSong(song));
    // console.log(selectedSong.id)
    console.log(song.id)
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      className={`p-3 border rounded cursor-pointer ${isSelected ? 'bg-green-500' : ''}`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ backgroundColor: isSelected ? 'green' : 'transparent' }}
    >
      <div className={`${isHovered ? 'ml-4 transition-all duration-500' : ''}`}>
        <strong>{song.title}</strong> by {song.artist}
      </div>
    </div>
  );
};

export default SongCard;