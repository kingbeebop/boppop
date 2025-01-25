import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { 
  Avatar, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  ListItemText 
} from '@mui/material';
import { 
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Login
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { logout } from '../redux/slices/authSlice';

export const LoginAvatar = () => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const user = useSelector((state: RootState) => state.auth.user);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    dispatch(logout());
    handleClose();
  };

  if (!user) {
    return (
      <Login />
    );
  }

  // TODO: Add profile picture support
  // Will need to:
  // 1. Add profile pic field to user model
  // 2. Add profile pic upload functionality in settings
  // 3. Update Avatar to use src={user.profilePic} when available
  return (
    <>
      <Avatar
        onClick={handleClick}
        sx={{
          bgcolor: theme.palette.primary.main,
          cursor: 'pointer',
          width: 40,
          height: 40,
        }}
      >
        {user.username.charAt(0).toUpperCase()}
      </Avatar>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => window.location.href = '/settings'}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Settings</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};