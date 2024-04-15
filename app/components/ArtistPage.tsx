// components/ArtistPage.tsx

import React, { useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { fetchArtistAsync } from '../redux/slices/artistSlice';

const ArtistPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch<any>();
  
  // Convert id to number or null if it's not a valid number
  const artistId = typeof id === 'string' ? parseInt(id, 10) : null;

  const artist = useSelector((state: RootState) =>
    state.artist.artists.find((artist) => artist.id === artistId)
  );

  useEffect(() => {
    if (artistId) {
      dispatch(fetchArtistAsync(artistId));
    }
  }, [artistId, dispatch]);

  if (artistId === null) {
    return <div>Artist Not Found</div>;
  }

  if (!artist) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{artist.username}</h1>
      {artist.profile_pic && (
        <Image
          src={artist.profile_pic}
          alt="Profile Pic"
          width={300}
          height={300}
        />
      )}
      <p>{artist.bio}</p>
    </div>
  );
};

export default ArtistPage;

// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/router';
// import { fetchArtistByName } from '../utils/api';
// // import Playlist from './Playlist';
// import Image from 'next/image'; // Import Image from Next.js

// const ArtistPage: React.FC = () => {
//   const router = useRouter();
//   const { name } = router.query;
//   const [artistData, setArtistData] = useState<any>(null); // Update with actual types

//   useEffect(() => {
//     const fetchData = async () => {
//       if (typeof name === 'string') {
//         try {
//           const data = await fetchArtistByName(name);
//           setArtistData(data);
//         } catch (error) {
//           console.error('Error fetching artist data:', error);
//         }
//       }
//     };

//     fetchData();
//   }, [name]);

//   if (!artistData) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div>
//       <h1>{artistData.name}</h1>
//       <Image src={artistData.profile_pic} alt="Profile Pic" width={300} height={300} /> {/* Updated to use Image */}
//       <p>{artistData.bio}</p>
//     </div>
//   );
// };

// export default ArtistPage;