import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { getSong } from '../../redux/slices/songSlice';
import { 
  Card, 
  CardContent, 
  Typography, 
  Link, 
  Box,
  Skeleton
} from '@mui/material';

interface SongCardProps {
  songId: string;
}

const SongCard: React.FC<SongCardProps> = ({ songId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const song = useSelector((state: RootState) => state.songs.byId[songId]);
  const status = useSelector((state: RootState) => state.songs.status);

  useEffect(() => {
    dispatch(getSong(songId));
  }, [dispatch, songId]);

  if (status === 'loading' && !song) {
    return (
      <Card>
        <CardContent>
          <Skeleton variant="text" width="60%" height={32} />
          <Skeleton variant="text" width="40%" height={24} />
        </CardContent>
      </Card>
    );
  }

  if (!song) {
    return null;
  }

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="h6" component="h2">
              {song.title}
            </Typography>
            <Typography color="text.secondary">
              {song.artist.name}
            </Typography>
          </Box>
          <Link 
            href={song.url} 
            target="_blank" 
            rel="noopener noreferrer"
            sx={{ ml: 2 }}
          >
            Listen
          </Link>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SongCard;