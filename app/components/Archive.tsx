import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { 
  fetchPlaylists, 
  selectPlaylists,
  selectPlaylistsState,
  setSearch
} from '../redux/slices/playlistSlice';
import { 
  Box, 
  TextField, 
  Button,
  CircularProgress
} from '@mui/material';
import PlaylistCard from './playlist/PlaylistCard';

const Archive: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const playlists = useSelector(selectPlaylists);
  const { loading, error, search, hasNextPage, endCursor } = useSelector(selectPlaylistsState);

  useEffect(() => {
    const loadPlaylists = async () => {
      try {
        await dispatch(fetchPlaylists({ first: 10 })).unwrap();
      } catch (err) {
        console.error('Failed to load playlists:', err);
      }
    };
    loadPlaylists();
  }, [dispatch]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearch = event.target.value;
    dispatch(setSearch(newSearch));
    dispatch(fetchPlaylists({ first: 10, filter: { search: newSearch } }));
  };

  const handleLoadMore = () => {
    dispatch(fetchPlaylists({ 
      first: 10, 
      after: endCursor ?? undefined,
      filter: { search }
    }));
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Box>
      <TextField
        fullWidth
        label="Search Playlists"
        value={search}
        onChange={handleSearchChange}
        margin="normal"
      />

      <Box sx={{ maxWidth: '800px', margin: '0 auto', padding: 2 }}>
        {playlists.map((playlist) => (
          <PlaylistCard key={playlist.id} playlist={playlist} />
        ))}
      </Box>

      {loading && (
        <Box display="flex" justifyContent="center" mt={2}>
          <CircularProgress />
        </Box>
      )}

      {hasNextPage && !loading && (
        <Box display="flex" justifyContent="center" mt={2}>
          <Button onClick={handleLoadMore} variant="contained">
            Load More
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Archive;