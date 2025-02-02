import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_ARTIST } from '../graphql/queries';
import { CircularProgress, Box, Typography } from '@mui/material';
import ArtistProfile from '../components/ArtistProfile';

export default function ArtistPage() {
  const { id } = useParams<{ id: string }>();
  const { loading, error, data } = useQuery(GET_ARTIST, {
    variables: { id },
    skip: !id
  });

  // Show loading spinner while fetching
  if (loading) {
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

  // Only show not found if we got a response but no artist data
  if (!loading && (!data?.artist)) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="200px"
      >
        <Typography variant="h6" color="text.secondary">
          Artist not found
        </Typography>
      </Box>
    );
  }

  // Show error message if query failed
  if (error) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="200px"
      >
        <Typography variant="h6" color="error">
          Error loading artist: {error.message}
        </Typography>
      </Box>
    );
  }

  return <ArtistProfile artist={data.artist} />;
} 