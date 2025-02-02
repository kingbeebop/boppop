import React from 'react';
import { Paper } from '@mui/material';
import SongCard from '../playlist/SongCard';

interface SongVoteCardProps {
  songId: string;
  isSelected: boolean;
  onSelect: () => void;
}

const SongVoteCard: React.FC<SongVoteCardProps> = ({
  songId,
  isSelected,
  onSelect,
}) => {
  return (
    <Paper 
      sx={{ 
        p: 2, 
        mb: 2, 
        bgcolor: isSelected ? 'gold' : 'background.paper',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 3,
        }
      }}
      onClick={onSelect}
    >
      <SongCard songId={songId} />
    </Paper>
  );
};

export default SongVoteCard; 