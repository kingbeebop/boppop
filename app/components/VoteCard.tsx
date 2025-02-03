import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { 
  Card, 
  CardContent, 
  Typography, 
  Link, 
  Box,
  Radio,
  FormControlLabel
} from '@mui/material';

const VoteCard: React.FC<{ songId: string }> = ({ songId }) => {
  const song = useSelector((state: RootState) => state.songs.byId[songId]);
  const artist = useSelector((state: RootState) =>
    song ? state.artists.byId[song.artist.id] : null
  );
  const ballot = useSelector((state: RootState) => state.contest.ballot);

  if (!song) {
    return null;
  }

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box flex={1}>
            <Typography variant="h6" component="h2">
              {song.title}
            </Typography>
            <Typography color="text.secondary">
              {song.artist.name}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <Link 
              href={song.url} 
              target="_blank" 
              rel="noopener noreferrer"
              sx={{ mr: 2 }}
            >
              Listen
            </Link>
            <FormControlLabel
              value={songId}
              control={<Radio />}
              label=""
              checked={ballot?.songId === songId}
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default VoteCard;
