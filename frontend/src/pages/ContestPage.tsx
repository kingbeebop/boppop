import { useQuery } from '@apollo/client';
import { GET_PLAYLISTS } from '../graphql/queries';
import { CircularProgress, Box, Typography } from '@mui/material';
import VotingInterface from '../components/VotingInterface';
import SongVoteCard from '../components/SongVoteCard';

export default function ContestPage() {
  const { loading, error, data } = useQuery(GET_PLAYLISTS, {
    variables: {
      first: 1,  // We only need the current contest
      filter: { 
        contest: true,
        active: true 
      }
    },
    fetchPolicy: 'network-only',  // Changed to prevent caching issues
  });

  console.log('Contest Page Render:', { loading, error, data }); // Debug log

  // Only show loading on initial load
  if (loading && !data) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="200px"
      >
        <Typography variant="h6" color="error">
          Error loading contest: {error.message}
        </Typography>
      </Box>
    );
  }

  const currentContest = data?.playlists?.edges?.[0]?.node;

  if (!currentContest) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="200px"
      >
        <Typography variant="h6" color="text.secondary">
          No active contest found
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {currentContest.theme}
      </Typography>
      <VotingInterface 
        contestId={currentContest.id} 
        songIds={currentContest.songIds} 
      />
    </Box>
  );
} 