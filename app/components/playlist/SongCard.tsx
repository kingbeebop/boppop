import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { setSelectedSong } from '../../redux/slices/songSlice';
import { ListItemButton, ListItemText, ListItemIcon } from '@mui/material';
import MusicNoteIcon from '@mui/icons-material/MusicNote';

interface SongCardProps {
  songId: string;
}

const SongCard: React.FC<SongCardProps> = ({ songId }) => {
  const dispatch = useDispatch();
  const song = useSelector((state: RootState) => state.songs.byId[songId]);
  const selectedSong = useSelector((state: RootState) => state.songs.selectedSong);
  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    console.log("CARD: ",songId);
  }, [songId]);

  useEffect(() => {
    console.log("Song: ",song);
  }, [song]);

  useEffect(() => {
    setIsSelected(selectedSong?.id === songId);
  }, [selectedSong, songId]);

  const handleClick = () => {
    dispatch(setSelectedSong(songId));
  };

  if (!song) return null;

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
        secondary={song.artistName}
        primaryTypographyProps={{
          fontWeight: isSelected ? 600 : 400,
        }}
      />
    </ListItemButton>
  );
};

export default SongCard;