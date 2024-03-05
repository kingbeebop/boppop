// components/Playlist.tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { fetchPlaylist, fetchArtistSongs } from '../utils/api';

interface PlaylistProps {
  playlistId?: string;
  artistName?: string;
}

const Playlist: React.FC<PlaylistProps> = ({ playlistId, artistName }) => {
  const router = useRouter();
  const [playlistData, setPlaylistData] = useState<any>(null); // Update with actual types

  useEffect(() => {
    const fetchData = async () => {
      try {
        let data;

        if (playlistId) {
          // Fetch playlist based on playlistId
          data = await fetchPlaylist(playlistId);
        } else if (artistName) {
          // Fetch artist songs based on artistName
          const artistSongs = await fetchArtistSongs(artistName);
          data = {
            theme: `${artistName}'s Song Submissions`,
            songs: artistSongs,
            reviews: [], // Add reviews if available
          };
        }

        setPlaylistData(data);
      } catch (error) {
        console.error('Error fetching playlist data:', error);
      }
    };

    fetchData();
  }, [playlistId, artistName]);

  if (!playlistData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{playlistData.theme}</h1>
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
