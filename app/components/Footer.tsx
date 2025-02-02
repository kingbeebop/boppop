import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { setSelectedSong } from '../redux/slices/songSlice';
import Playhead from './Playhead';
import { Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const Footer: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isMinimized, setIsMinimized] = React.useState(false);
  const selectedSong = useSelector((state: RootState) => state.songs.selectedSong);
  const dispatch = useDispatch();

  // When selectedSong changes, open the playhead
  useEffect(() => {
    if (selectedSong) {
      setIsOpen(true);
      setIsMinimized(false);
    }
  }, [selectedSong]);

  const handleClose = () => {
    setIsOpen(false);
    dispatch(setSelectedSong(null));
  };

  const handleToggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  if (!selectedSong || !isOpen) {
    return null;
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        width: '100%',
        bgcolor: '#1a202c',
        zIndex: 50,
        transition: 'height 0.3s ease-in-out',
      }}
    >
      {/* Control bar */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          height: '32px',
          borderBottom: isMinimized ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
          px: 1,
          gap: 1,
        }}
      >
        <IconButton
          size="small"
          onClick={handleToggleMinimize}
          sx={{ color: 'white' }}
        >
          {isMinimized ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </IconButton>
        <IconButton
          size="small"
          onClick={handleClose}
          sx={{ color: 'white' }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Playhead */}
      <Box 
        sx={{ 
          height: isMinimized ? '0px' : '166px',
          overflow: 'hidden',
          transition: 'height 0.3s ease-in-out',
        }}
      >
        <Playhead song={selectedSong} />
      </Box>
    </Box>
  );
};

export default Footer;