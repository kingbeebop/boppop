import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import VotingInterface from './contest/VotingInterface';
import { Box, Typography, Button } from '@mui/material';
import { useRouter } from 'next/router';
import { AppDispatch } from '../redux/store';
import { selectChallenge, getChallenge } from '../redux/slices/challengeSlice';

const Contest: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const challenge = useSelector(selectChallenge);

  useEffect(() => {
    // Only fetch if we don't have data and aren't currently loading
    if (!challenge.initialized && challenge.status === 'idle') {
      console.log("Fetching challenge data");
      dispatch(getChallenge());
    }
  }, [dispatch, challenge.initialized, challenge.status]);

  if (challenge.status === 'loading') {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h5">
          Loading contest...
        </Typography>
      </Box>
    );
  }

  if (!challenge.contest) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h5">
          Voting not available yet
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => router.push('/challenge')}
          sx={{ mt: 3 }}
        >
          Submit a Song
        </Button>
      </Box>
    );
  }

  return <VotingInterface />;
};

export default Contest;
