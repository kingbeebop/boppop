import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import { LoginAvatar } from './LoginAvatar';

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          BopPop
        </Typography>
        <LoginAvatar />
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;