// pages/playlist/[id].tsx
import { useRouter } from 'next/router';
import Playlist from '../../components/playlist/Playlist';

const PlaylistPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  return <Playlist id={id as string} />;
};

export default PlaylistPage;