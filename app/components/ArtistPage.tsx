// components/ArtistPage.tsx

import React, { useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { getArtist } from '../redux/slices/artistSlice';
import { Box, Typography, CircularProgress, Avatar } from '@mui/material';

const ArtistPage: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  
  // Get id from router and convert to number
  const artistId = typeof router.query.id === 'string' ? router.query.id : null;
  
  // Select artist from store using artistId
  const artist = useSelector((state: RootState) => 
    artistId ? state.artists.byId[artistId] : null
  );
  const loading = useSelector((state: RootState) => state.artists.loading);
  const error = useSelector((state: RootState) => state.artists.error);

  useEffect(() => {
    if (artistId && !artist) {
      dispatch(getArtist(artistId))
        .unwrap()
        .then(result => {
          if (!result) {
            // Handle artist not found case
            console.error('Artist not found');
          }
        });
    }
  }, [artistId, artist, dispatch]);

  if (!artistId) {
    return (
      <Box p={3}>
        <Typography color="error">Invalid artist ID</Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!artist) {
    return (
      <Box p={3}>
        <Typography>Artist not found</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" alignItems="center" gap={3} mb={4}>
        {artist.profilePic ? (
          <Image 
            src={artist.profilePic} 
            alt={artist.name} 
            width={100} 
            height={100}
            style={{ borderRadius: '50%' }}
          />
        ) : (
          <Avatar sx={{ width: 100, height: 100 }}>
            {artist.name[0].toUpperCase()}
          </Avatar>
        )}
        <Box>
          <Typography variant="h4">{artist.name}</Typography>
        </Box>
      </Box>

      {artist.bio && (
        <Box mb={4}>
          <Typography variant="h6" gutterBottom>About</Typography>
          <Typography>{artist.bio}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default ArtistPage;