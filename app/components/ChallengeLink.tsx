import React, { useEffect } from 'react';
import Link from 'next/link';
import Countdown from './Countdown';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { getChallenge, selectChallenge } from '../redux/slices/challengeSlice'; // Import fetchChallenge and selectChallenge from challengeSlice

const ChallengeLink: React.FC = () => {
  const { theme, contest } = useSelector(selectChallenge); // Get theme and contest from challengeSlice
  const dispatch = useDispatch<any>();

  useEffect(() => {
    dispatch(getChallenge());
  }, [dispatch]);

  return (
    <div>
      {contest ? (
        <Link href="/vote">
          <a className="underline">Vote or Die</a>
        </Link>
      ) : theme ? (
        <Link href="/challenge">
          <a className="underline">Current Theme: {theme}</a>
        </Link>
      ) : (
        <span>No current theme</span>
      )}
      <Countdown />
    </div>
  );
};

export default ChallengeLink;
