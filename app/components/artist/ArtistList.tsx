// components/ArtistList.tsx

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { getArtists, selectArtists, selectArtistsState, setSearch } from '../../redux/slices/artistSlice';
import { Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import ArtistCard from './ArtistCard';

const ArtistList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const artists = useSelector(selectArtists);
  const { loading, error, search, hasNextPage, endCursor } = useSelector(selectArtistsState);

  useEffect(() => {
    const loadArtists = async () => {
      try {
        await dispatch(getArtists({ first: 10 })).unwrap();
      } catch (err) {
        console.error('Failed to load artists:', err);
      }
    };
    loadArtists();
  }, [dispatch]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearch = event.target.value;
    dispatch(setSearch(newSearch));
    dispatch(getArtists({ first: 10, search: newSearch }));
  };

  const handleLoadMore = () => {
    dispatch(getArtists({ 
      first: 10, 
      after: endCursor ?? undefined,
      search
    }));
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Box>
      <TextField
        fullWidth
        label="Search Artists"
        value={search}
        onChange={handleSearchChange}
        margin="normal"
      />

      {loading ? (
        <Box display="flex" justifyContent="center" mt={2}>
          <CircularProgress />
        </Box>
      ) : artists.length === 0 ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <Typography color="text.secondary">
            {search ? 'No artists found matching your search' : 'No artists available'}
          </Typography>
        </Box>
      ) : (
        <>
          <Box sx={{ maxWidth: '800px', margin: '0 auto', padding: 2 }}>
            {artists.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </Box>

          {hasNextPage && (
            <Box display="flex" justifyContent="center" mt={2}>
              <Button onClick={handleLoadMore} variant="contained">
                Load More
              </Button>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default ArtistList;
