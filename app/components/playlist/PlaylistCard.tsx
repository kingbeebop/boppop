// components/PlaylistCard.tsx
import React from 'react';
import { Playlist } from '../../types';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box,
  styled
} from '@mui/material';
import { format } from 'date-fns';
import { useRouter } from 'next/router';

const StyledCard = styled(Card)(({ theme }) => ({
  width: '100%',
  marginBottom: theme.spacing(1),
  transition: 'background-color 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.primary.light,
  },
}));

const StyledCardContent = styled(CardContent)({
  padding: '16px !important',
  '&:last-child': {
    paddingBottom: '16px !important',
  },
});

const NumberBubble = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  borderRadius: '50%',
  width: '40px',
  height: '40px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: theme.spacing(2),
  fontWeight: 'bold',
}));

const DateBox = styled(Box)(({ theme }) => ({
  minWidth: '120px',
  marginLeft: theme.spacing(2),
  textAlign: 'right',
  color: theme.palette.text.secondary,
}));

interface PlaylistCardProps {
  playlist: Playlist;
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/playlist/${playlist.id}`);
  };

  return (
    <StyledCard onClick={handleClick}>
      <StyledCardContent>
        <Box display="flex" alignItems="center">
          <NumberBubble>
            {playlist.number}
          </NumberBubble>
          <Box flex={1}>
            <Typography variant="h6" component="div">
              {playlist.theme}
            </Typography>
          </Box>
          {playlist.contest && (
            <Box 
              sx={{ 
                backgroundColor: 'secondary.main',
                color: 'secondary.contrastText',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '0.875rem',
                marginLeft: 2
              }}
            >
              Contest
            </Box>
          )}
          <DateBox>
            <Typography variant="body2" color="inherit">
              {format(new Date(playlist.date), 'MMM d, yyyy')}
            </Typography>
          </DateBox>
        </Box>
      </StyledCardContent>
    </StyledCard>
  );
};

export default PlaylistCard;
