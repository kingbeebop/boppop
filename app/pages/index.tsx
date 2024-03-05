// pages/index.tsx
import React from 'react';
import Banner from '../components/Banner';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Container from '../components/Container';

const Home: React.FC = () => {
  return (
    <div>
      <Banner />
      <Navbar />
      <div className="flex">
        <Sidebar />
        <Container>
          {/* Your main body components go here */}
        </Container>
      </div>
    </div>
  );
};

export default Home;
