// components/PlaylistList.tsx
import React from 'react';
import { useRouter } from 'next/router';
import { Box, Typography, Container } from '@mui/material';
import SelectableList, { SelectableItem } from './common/SelectableList';
import { Playlist } from '../types';
import { selectPlaylists } from '../redux/slices/playlistSlice';
import { useSelector } from 'react-redux';

const ChallengeList: React.FC = ({ 
}) => {
  const router = useRouter();
  const { playlists, loading } = useSelector(selectPlaylists);

  const playlistItems: SelectableItem[] = playlists.map((playlist: Playlist) => ({
    id: playlist.id,
    title: `Bop Pop #${playlist.number}`,
    subtitle: playlist.theme,
    data: playlist,
  }));

  const handleSelect = (item: SelectableItem) => {
    router.push(`/playlist/${item.id}`);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Playlists
        </Typography>
        <SelectableList
          items={playlistItems}
          onSelect={handleSelect}
          isLoading={loading}
          emptyMessage="No playlists available"
          sx={{ mt: 3 }}
        />
      </Box>
    </Container>
  );
};

export default ChallengeList;
