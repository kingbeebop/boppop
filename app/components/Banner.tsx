import React from 'react';
import { useSelector } from 'react-redux';
import { 
  Box, 
  Typography, 
  Container,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { RootState } from '../redux/store';
import { AuthState } from '../redux/slices/authSlice';
import ChallengeLink from './ChallengeLink';

const Banner: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const user = useSelector<RootState, AuthState['user']>((state) => state.auth.user);
  const contest = useSelector<RootState, boolean>((state) => state.challenge.contest);

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            py: isMobile ? 2 : 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 700,
              color: theme.palette.primary.main,
            }}
          >
            Bop Pop Challenge
          </Typography>

          {contest ? (
            <Typography
              variant="h6"
              sx={{
                fontWeight: 500,
              }}
            >
              Vote or Die
            </Typography>
          ) : (
            <ChallengeLink />
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default Banner;
