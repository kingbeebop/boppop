import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store'; // Import the RootState type
import ChallengeLink from './ChallengeLink';
import Login from './Login'; // Import Login component

const Banner: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user); // Retrieve user from Redux store

  // Assuming theme and contest are received as props
  const theme = 'Theme from props';
  const contest = false;

  // Calculate the minimum height of the Banner component
  const minHeight = user ? '10rem' : '16rem'; // Adjust as needed

  return (
    <div className="bg-black p-4 d-flex justify-content-between align-items-center position-relative" style={{ minHeight }}>
      <div className="w-100 text-center"> {/* Full-width container */}
        <h1 className="display-3 fw-bold mb-4" style={{ color: '#8A2BE2' }}>Bop Pop Challenge</h1>
        <ChallengeLink theme={theme} />
      </div>
        <div className="position-absolute top-0 end-0"> {/* Absolute positioned Login component */}
          <Login />
        </div>
    </div>
  );
};

export default Banner;