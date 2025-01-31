// components/Layout.tsx
import React, { ReactNode } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Container, useTheme, useMediaQuery } from '@mui/material';
import { RootState } from '../redux/store';
import { 
  closeLoginModal, 
  closeRegisterModal, 
  openLoginModal, 
  openRegisterModal 
} from '../redux/slices/authSlice';
import Navbar from '../components/Navbar';
import Banner from '../components/Banner';
import Footer from '../components/Footer';
import Login from '../components/login/Login';
import Register from '../components/login/Register';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { showLoginModal, showRegisterModal } = useSelector(
    (state: RootState) => state.auth
  );

  const handleLoginClose = () => dispatch(closeLoginModal());
  const handleRegisterClose = () => dispatch(closeRegisterModal());
  const handleSwitchToRegister = () => dispatch(openRegisterModal());
  const handleSwitchToLogin = () => dispatch(openLoginModal());

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <Banner />
      <Navbar />
      <Container
        component="main"
        maxWidth="md"
        sx={{
          flex: 1,
          py: 4,
          px: isMobile ? 2 : 3,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {children}
      </Container>
      <Footer />

      <Login 
        open={showLoginModal}
        onClose={handleLoginClose}
        onRegisterClick={handleSwitchToRegister}
      />
      <Register
        open={showRegisterModal}
        onClose={handleRegisterClose}
        onLoginClick={handleSwitchToLogin}
      />
    </Box>
  );
};

export default Layout;
