// components/Playlist.tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { fetchPlaylist } from '../utils/api';

const Playlist: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [playlistData, setPlaylistData] = useState<any>(null); // Update with actual types

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchPlaylist(id as string);
        setPlaylistData(data);
      } catch (error) {
        console.error('Error fetching playlist data:', error);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  if (!playlistData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Bop Pop {id} - "{playlistData.theme}"</h1>
      <ul>
        {playlistData.songs.map((song: any) => (
          <li key={song.id}>
            {song.name} - {song.artist} ({song.soundcloudUrl})
          </li>
        ))}
      </ul>
      <div>
        <h2>Reviews:</h2>
        {playlistData.reviews.map((review: any) => (
          <div key={review.id}>
            <p>{review.author}</p>
            <p>{review.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Playlist;
