import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store'; // Import the RootState type
import { AuthState } from '../redux/slices/authSlice'; // Import the AuthState type
import ChallengeLink from './ChallengeLink';

const Banner: React.FC = () => {
  const user = useSelector<RootState, AuthState['user']>((state) => state.auth.user); // Retrieve user from Redux store
  const contest = useSelector<RootState, boolean>((state) => state.challenge.contest); // Retrieve contest from Redux store

  // Calculate the minimum height of the Banner component
  const minHeight = user ? '10rem' : '16rem'; // Adjust as needed

  return (
    <div className="bg-black p-4 d-flex justify-content-between align-items-center position-relative" style={{ minHeight }}>
      <div className="w-100 text-center"> {/* Full-width container */}
        <h1 className="display-3 fw-bold mb-4" style={{ color: '#8A2BE2' }}>Bop Pop Challenge</h1>
        {contest ?
          <div>Vote or Die</div> :
          <ChallengeLink />
        }
      </div>
      <div className="position-absolute top-0 end-0"> {/* Absolute positioned Login component */}
        {/* Login component here */}
      </div>
    </div>
  );
};

export default Banner;
