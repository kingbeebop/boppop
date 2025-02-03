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
import { selectChallenge } from '@/redux/slices/challengeSlice';

const VotingInterface = () => {
  const dispatch = useDispatch<AppDispatch>();
  const challenge = useSelector(selectChallenge);
  const ballot = useSelector((state: RootState) => state.contest.ballot);

  const handleVote = (songId: string) => {
    dispatch(setBallot({
      ...ballot,
      songId,
      playlistId: challenge.playlist_id ?? ''
    }));
  };

  const handleCommentChange = (comment: string) => {
    dispatch(setBallot({
      ...ballot,
      comments: comment
    }));
  };

  if (!challenge.contest) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h5">
          No active contest found
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {challenge.theme}
      </Typography>
      
      {challenge.songIds.map(songId => (
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
          label="Your comments on this contest"
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