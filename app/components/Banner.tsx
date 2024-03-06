// components/Banner.tsx
import React from 'react';
import ChallengeLink from './ChallengeLink';

const Banner: React.FC = () => {
  // Assuming theme and contest are received as props
  const theme = 'Theme from props';
  const contest = false;

  return (
    <div className="bg-gray-800 text-white p-4">
      <h1 className="text-3xl font-bold">Bop Pop Challenge</h1>
      <ChallengeLink theme={theme} />
    </div>
  );
};

export default Banner;