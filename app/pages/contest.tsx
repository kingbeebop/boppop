import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import Contest from '../components/Contest';

const ContestPage: React.FC = () => {
  const { contest, status } = useSelector((state: RootState) => state.challenge);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!contest) {
    return (
      <div>
        The current challenge isn&apos;t open for voting yet.
        Come back Wednesday to vote for this week&apos;s BIG WINNER!
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-8">
      <Contest />
    </div>
  );
};

export default ContestPage;