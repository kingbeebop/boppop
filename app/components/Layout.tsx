// components/Layout.tsx
import React, { ReactNode } from 'react';
import Banner from './Banner';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Container from './Container';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div>
      <Banner />
      <Navbar />
      <div className="flex">
        <Container>
          {children}
        </Container>
      </div>
    </div>
  );
};

export default Layout;
