// components/Layout.tsx
import React, { ReactNode } from 'react';
import { Box, Container, useTheme, useMediaQuery } from '@mui/material';
import Navbar from '../components/Navbar';
import Banner from '../components/Banner';
import Footer from '../components/Footer';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
    </Box>
  );
};

export default Layout;
