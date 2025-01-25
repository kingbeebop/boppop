import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { setSelectedSong } from '../redux/slices/songSlice';
import { Song } from '../types';
import { ListItemButton, ListItemText, ListItemIcon } from '@mui/material';
import MusicNoteIcon from '@mui/icons-material/MusicNote';

interface SongCardProps {
  song: Song;
}

const SongCard: React.FC<SongCardProps> = ({ song }) => {
  const dispatch = useDispatch();
  const selectedSong = useSelector((state: RootState) => state.song.selectedSong);
  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    setIsSelected(selectedSong?.id === song.id);
  }, [selectedSong?.id, song.id]);

  const handleClick = () => {
    dispatch(setSelectedSong(song));
  };

  return (
    <ListItemButton
      onClick={handleClick}
      selected={isSelected}
      sx={{
        borderRadius: 1,
        mb: 1,
        '&.Mui-selected': {
          backgroundColor: 'primary.main',
          '&:hover': {
            backgroundColor: 'primary.dark',
          },
        },
      }}
    >
      <ListItemIcon>
        <MusicNoteIcon color={isSelected ? 'primary' : 'inherit'} />
      </ListItemIcon>
      <ListItemText
        primary={song.title}
        secondary={song.artist}
        primaryTypographyProps={{
          fontWeight: isSelected ? 600 : 400,
        }}
      />
    </ListItemButton>
  );
};

export default SongCard;