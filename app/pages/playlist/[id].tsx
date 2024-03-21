// pages/playlist/[id].tsx
import { useRouter } from 'next/router';
import Playlist from '../../components/Playlist';

const PlaylistPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  // Convert id to number or fallback to 0 if it's not a valid number
  const playlistId = typeof id === 'string' ? parseInt(id, 10) || 0 : 0;

  return <Playlist id={playlistId} />;
};

export default PlaylistPage;