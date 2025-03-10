import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { 
  getChallenge, 
  selectChallenge
} from '../redux/slices/challengeSlice';
import { addSong } from '../redux/slices/songSlice';
import SubmissionForm from './SubmissionForm';
import SongCard from './playlist/SongCard';
import { 
  Box, 
  Typography, 
  Paper, 
  CircularProgress, 
  Chip,
  Link as MuiLink,
  Divider,
  Container,
  Stack
} from '@mui/material';
import { MusicNote as MusicNoteIcon } from '@mui/icons-material';

const Challenge: React.FC = () => {
  const dispatch = useDispatch<any>();
  const challenge = useSelector(selectChallenge);
  const { song: currentSubmission } = useSelector((state: RootState) => state.submission);

  console.log('Challenge Component Render:', {
    challengeState: challenge,
    submissionState: currentSubmission,
    status: challenge.status,
    theme: challenge.theme
  });

  useEffect(() => {
    console.log('Challenge useEffect triggered');
    dispatch(getChallenge());
  }, [dispatch]);

  // Add song to songs slice when currentSubmission changes
  useEffect(() => {
    if (currentSubmission) {
      dispatch(addSong(currentSubmission));
    }
  }, [currentSubmission, dispatch]);

  // Show loading state only during initial load
  if (challenge.status === 'loading' && !challenge.theme) {
    console.log('Rendering loading state');
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="50vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  // Show error state if fetch failed
  if (challenge.status === 'failed') {
    console.log('Rendering error state');
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="50vh"
      >
        <Typography color="error">Failed to load challenge</Typography>
      </Box>
    );
  }

  console.log('Rendering main challenge content');
  return (
    <Container maxWidth="md">
      <Stack spacing={4} sx={{ py: 4 }}>
        {/* Challenge Header */}
        <Paper 
          elevation={3} 
          sx={{ 
            p: 3,
            background: (theme) => `linear-gradient(45deg, 
              ${theme.palette.primary.main} 0%, 
              ${theme.palette.primary.light} 100%
            )`,
            color: 'white'
          }}
        >
          <Typography 
            variant="h5" 
            component="h2" 
            gutterBottom
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <MusicNoteIcon />
            Bop Pop {challenge.number}
          </Typography>
          <Typography variant="h3" component="h1" gutterBottom sx={{ textAlign: 'center' }}>
            {challenge.theme}
          </Typography>
          {challenge.contest && (
            <Chip 
              label="Contest Week" 
              color="secondary" 
              sx={{ mt: 1 }}
            />
          )}
        </Paper>

        {/* Current Submission Section */}
        {currentSubmission && (
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Current Submission
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ my: 2 }}>
              <SongCard songId={currentSubmission.id} />
            </Box>
          </Paper>
        )}

        {/* Submission Form */}
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Submit Your Song
          </Typography>
          <Divider sx={{ my: 2 }} />
          <SubmissionForm />
        </Paper>
      </Stack>
    </Container>
  );
};

export default Challenge;
