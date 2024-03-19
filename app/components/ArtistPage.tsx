import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { fetchArtist } from '../utils/api';
import Playlist from './Playlist';
import Image from 'next/image'; // Import Image from Next.js

const ArtistPage: React.FC = () => {
  const router = useRouter();
  const { name } = router.query;
  const [artistData, setArtistData] = useState<any>(null); // Update with actual types

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchArtist(encodeURIComponent(name as string));
        setArtistData(data);
      } catch (error) {
        console.error('Error fetching artist data:', error);
      }
    };

    if (name) {
      fetchData();
    }
  }, [name]);

  if (!artistData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{artistData.name}</h1>
      <Image src={artistData.profile_pic} alt="Profile Pic" width={300} height={300} /> {/* Updated to use Image */}
      <p>{artistData.bio}</p>
      <Playlist artistName={artistData.name} />
    </div>
  );
};

export default ArtistPage;