import React, { useEffect, useState } from 'react';
import SongCard from './SongCard';
import Playhead from './Playhead';
import { fetchArtistSongs } from '../utils/api'; // Update import path as needed

interface Song {
  id: string;
  name: string;
  artist: string;
  url: string;
}

interface PlaylistProps {
  playlist?: { theme: string; songs: Song[]; reviews: any[]; winner: string }; // Update with actual types
  artistName?: string;
  bopography?: boolean;
}

const Playlist: React.FC<PlaylistProps> = ({ playlist, artistName, bopography }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    if (!playlist && artistName) {
      fetchArtistPlaylist(artistName);
    } else if (playlist && playlist.songs.length > 0) {
      setCurrentSong(playlist.songs[0]);
      setAutoplay(true);
    }
  }, [playlist, artistName]);

  async function fetchArtistPlaylist(artistName: string) {
    try {
      const artistSongs = await fetchArtistSongs(artistName);
      const data = {
        theme: `${artistName}'s Song Submissions`,
        songs: artistSongs,
        reviews: [], // Add reviews if available
      };
      setCurrentSong(data.songs[0]);
      setAutoplay(true);
    } catch (error) {
      console.error('Error fetching artist playlist:', error);
    }
  }

  function handleSelect(song: Song) {
    setCurrentSong(song);
    setAutoplay(true);
  }

  return (
    <div className={bopography ? 'artist-playlist' : 'playlist-container'}>
      {currentSong ? (
        <Playhead song={currentSong} autoplay={autoplay} />
      ) : (
        <div>No songs</div>
      )}

      {playlist?.songs.map((song) => (
        <SongCard
          key={song.id}
          onSelect={() => handleSelect(song)}
          currentPlayingId={currentSong?.id}
          song={song}
          winner={playlist.winner}
        />
      ))}
    </div>
  );
};

export default Playlist;

// // components/Playlist.tsx
// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/router';
// import { fetchPlaylist, fetchArtistSongs } from '../utils/api';

// interface PlaylistProps {
//   playlistId?: string;
//   artistName?: string;
// }

// const Playlist: React.FC<PlaylistProps> = ({ playlistId, artistName }) => {
//   const router = useRouter();
//   const [playlistData, setPlaylistData] = useState<any>(null); // Update with actual types

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         let data;

//         if (playlistId) {
//           // Fetch playlist based on playlistId
//           data = await fetchPlaylist(playlistId);
//         } else if (artistName) {
//           // Fetch artist songs based on artistName
//           const artistSongs = await fetchArtistSongs(artistName);
//           data = {
//             theme: `${artistName}'s Song Submissions`,
//             songs: artistSongs,
//             reviews: [], // Add reviews if available
//           };
//         }

//         setPlaylistData(data);
//       } catch (error) {
//         console.error('Error fetching playlist data:', error);
//       }
//     };

//     fetchData();
//   }, [playlistId, artistName]);

//   if (!playlistData) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div>
//       <h1>{playlistData.theme}</h1>
//       <ul>
//         {playlistData.songs.map((song: any) => (
//           <li key={song.id}>
//             {song.name} - {song.artist} ({song.soundcloudUrl})
//           </li>
//         ))}
//       </ul>
//       <div>
//         <h2>Reviews:</h2>
//         {playlistData.reviews.map((review: any) => (
//           <div key={review.id}>
//             <p>{review.author}</p>
//             <p>{review.body}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Playlist;
