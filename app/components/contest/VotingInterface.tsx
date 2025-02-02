import React from 'react';
import { 
  Box, 
  Typography, 
  Button,
  TextField,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { setBallot, submitBallot } from '../../redux/slices/contestSlice';
import SongVoteCard from './SongVoteCard';
import { useRouter } from 'next/router';

interface VotingInterfaceProps {
  playlistId: string;
}

const VotingInterface: React.FC<VotingInterfaceProps> = ({ playlistId }) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const playlist = useSelector((state: RootState) => state.playlists.byId[playlistId]);
  const ballot = useSelector((state: RootState) => state.contest.ballot);

  if (!playlist) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h5">
          Voting hasn&apos;t begun yet
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => router.push('/challenge')}
          sx={{ mt: 3 }}
        >
          Submit a Song
        </Button>
      </Box>
    );
  }

  const handleVote = (songId: string) => {
    dispatch(setBallot({
      ...ballot,
      songId,
      playlistId
    }));
  };

  const handleCommentChange = (comment: string) => {
    dispatch(setBallot({
      ...ballot,
      comments: comment
    }));
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Vote for Your Favorite
      </Typography>
      
      {playlist.songIds.map(songId => (
        <SongVoteCard
          key={songId}
          songId={songId}
          isSelected={ballot?.songId === songId}
          onSelect={() => handleVote(songId)}
        />
      ))}

      <Box sx={{ mt: 3, mb: 3 }}>
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Your comments on this playlist"
          value={ballot?.comments || ''}
          onChange={(e) => handleCommentChange(e.target.value)}
        />
      </Box>

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button
          variant="contained"
          size="large"
          onClick={() => dispatch(submitBallot())}
          disabled={!ballot?.songId}
        >
          Submit Vote
        </Button>
      </Box>
    </Box>
  );
};

export default VotingInterface; 