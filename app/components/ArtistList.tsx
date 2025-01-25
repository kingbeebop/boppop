// components/ArtistList.tsx

import React from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { Box, Typography, Container } from '@mui/material';
import { RootState } from '../redux/store';
import SelectableList, { SelectableItem } from './common/SelectableList';
import { Artist } from '../types';

const ArtistList: React.FC = () => {
  const router = useRouter();
  const { artists, loading } = useSelector((state: RootState) => state.artist);

  const artistItems: SelectableItem[] = artists.map((artist: Artist) => ({
    id: artist.id,
    title: artist.username,
    subtitle: artist.bio ?? 'No bio available',
    imageUrl: artist.profile_pic ?? undefined,
    data: artist,
  }));

  const handleSelect = (item: SelectableItem) => {
    router.push(`/artists/${item.id}`);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Artists
        </Typography>
        <SelectableList
          items={artistItems}
          onSelect={handleSelect}
          isLoading={loading}
          showAvatar
          emptyMessage="No artists found yet"
          sx={{ mt: 3 }}
        />
      </Box>
    </Container>
  );
};

export default ArtistList;
