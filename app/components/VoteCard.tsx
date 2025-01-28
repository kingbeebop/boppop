import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { setBallot } from '../redux/slices/contestSlice';

interface VoteCardProps {
  songId: string;
  playlistId: string;
}

const VoteCard: React.FC<VoteCardProps> = ({ songId, playlistId }) => {
  const dispatch = useDispatch();
  const song = useSelector((state: RootState) => state.songs.byId[songId]);
  const artist = useSelector((state: RootState) => 
    song ? state.artists.byId[song.artistId] : null
  );
  const ballot = useSelector((state: RootState) => state.contest.ballot);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    dispatch(setBallot({ 
      songId,
      playlistId,
      comments: ballot?.comments || ''
    }));
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  if (!song || !artist) return null;

  return (
    <div
      className={`p-3 border rounded cursor-pointer ${ballot?.songId === songId ? 'bg-green-500' : ''}`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={`${isHovered ? 'ml-4 transition-all duration-500' : ''}`}>
        <strong>{song.title}</strong> by {artist.name}
      </div>
    </div>
  );
};

export default VoteCard;
