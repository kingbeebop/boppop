import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  IconButton, 
  Box, 
  Tooltip, 
  Zoom 
} from '@mui/material';
import { 
  Home as HomeIcon,
  Info as InfoIcon,
  Add as AddIcon,
  People as PeopleIcon,
  Archive as ArchiveIcon 
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import { LoginAvatar } from './LoginAvatar';

const Navbar = () => {
  const router = useRouter();

  const iconButtonStyle = {
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'scale(1.1)',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    '&:active': {
      transform: 'scale(0.95)',
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
          <Tooltip 
            title="Home" 
            enterDelay={200}
            leaveDelay={0}
            arrow
            placement="bottom"
          >
            <IconButton
              color="inherit"
              onClick={() => router.push('/')}
              aria-label="home"
              sx={iconButtonStyle}
            >
              <HomeIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip 
            title="About" 
            enterDelay={200}
            leaveDelay={0}
            arrow
            placement="bottom"
          >
            <IconButton
              color="inherit"
              onClick={() => router.push('/about')}
              aria-label="about"
              sx={iconButtonStyle}
            >
              <InfoIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip 
            title="Submit Song" 
            enterDelay={200}
            leaveDelay={0}
            arrow
            placement="bottom"
          >
            <IconButton
              color="inherit"
              onClick={() => router.push('/challenge')}
              aria-label="submit"
              sx={iconButtonStyle}
            >
              <AddIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip 
            title="View Artists" 
            enterDelay={200}
            leaveDelay={0}
            arrow
            placement="bottom"
          >
            <IconButton
              color="inherit"
              onClick={() => router.push('/artists')}
              aria-label="artists"
              sx={iconButtonStyle}
            >
              <PeopleIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip 
            title="Browse Archive" 
            enterDelay={200}
            leaveDelay={0}
            arrow
            placement="bottom"
          >
            <IconButton
              color="inherit"
              onClick={() => router.push('/archive')}
              aria-label="archive"
              sx={iconButtonStyle}
            >
              <ArchiveIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <LoginAvatar />
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;