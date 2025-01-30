// components/ArtistCard.tsx
import React from 'react';
import { Artist } from '../../types';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Avatar,
  styled
} from '@mui/material';
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
}));

interface ArtistCardProps {
  artist: Artist;
}

const ArtistCard: React.FC<ArtistCardProps> = ({ artist }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/artist/${artist.id}`);
  };

  return (
    <StyledCard onClick={handleClick}>
      <StyledCardContent>
        <Box display="flex" alignItems="center">
          <Avatar 
            src={artist.profilePic || undefined}
            alt={artist.name}
            sx={{ width: 48, height: 48, marginRight: 2 }}
          />
          <Box flex={1}>
            <Typography variant="h6" component="div">
              {artist.name}
            </Typography>
            {artist.bio && (
              <Typography variant="body2" color="text.secondary" noWrap>
                {artist.bio}
              </Typography>
            )}
          </Box>
        </Box>
      </StyledCardContent>
    </StyledCard>
  );
};

export default ArtistCard;