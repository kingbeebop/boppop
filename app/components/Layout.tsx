// components/Layout.tsx
import React, { ReactNode } from 'react';
import Banner from './Banner';
import Navbar from './Navbar';
import Footer from './Footer';
import Container from './Container';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Banner />
      <Navbar />
      <div className="flex-1 mx-auto py-8 max-width-md"style={{ maxWidth: '50rem' }}>
        <Container>{children}</Container>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
