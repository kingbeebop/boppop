import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { 
  fetchChallenge, 
  selectChallenge
} from '../redux/slices/challengeSlice';
import { fetchSubmissionData } from '../redux/slices/submissionSlice';
import SubmissionForm from './SubmissionForm';
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
    dispatch(fetchChallenge());
    dispatch(fetchSubmissionData());
  }, [dispatch]);

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
          <Typography variant="h3" component="h1" gutterBottom>
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
            <Stack spacing={2}>
              <Typography variant="body1">
                <strong>Title:</strong> {currentSubmission.title}
              </Typography>
              <Box>
                <MuiLink 
                  href={currentSubmission.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <MusicNoteIcon fontSize="small" />
                  Listen on SoundCloud
                </MuiLink>
              </Box>
            </Stack>
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
