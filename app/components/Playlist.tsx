import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { fetchPlaylist } from '../redux/slices/playlistSlice';
import { fetchSongsByIds } from '../redux/slices/songSlice';
import SongCard from './SongCard';
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Stack,
  Container
} from '@mui/material';
import { formatDate } from '../utils/date';

interface PlaylistProps {
  id: string;
}

const Playlist: React.FC<PlaylistProps> = ({ id }) => {
  const dispatch = useDispatch<AppDispatch>();
  const playlist = useSelector((state: RootState) => state.playlists.byId[id]);
  const loading = useSelector((state: RootState) => state.playlists.loading);
  const error = useSelector((state: RootState) => state.playlists.error);

  useEffect(() => {
    if (!playlist) {
      dispatch(fetchPlaylist(id));
    }
  }, [dispatch, id, playlist]);

  useEffect(() => {
    if (playlist?.songIds.length) {
      dispatch(fetchSongsByIds(playlist.songIds));
    }
  }, [dispatch, playlist?.songIds]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={2}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!playlist) {
    return null;
  }

  return (
    <Container maxWidth="lg">
      <Stack spacing={4} py={4}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Bop Pop #{playlist.number}
          </Typography>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            {playlist.theme}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {formatDate(playlist.date)}
          </Typography>
        </Box>

        <Stack spacing={2}>
          {playlist.songIds.map((songId) => (
            console.log(songId),
            <SongCard key={songId} songId={songId} />
          ))}
        </Stack>
      </Stack>
    </Container>
  );
};

export default Playlist;
