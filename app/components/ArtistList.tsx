// components/ArtistList.tsx
import React, { useState, useEffect } from 'react';
import { fetchArtists } from '../utils/api';
import ArtistCard from './ArtistCard';

const ArtistList: React.FC = () => {
  const [artists, setArtists] = useState<{ id: string; username: string }[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const fetchArtistsData = async () => {
    try {
      const data = await fetchArtists(10, page, search);
      setArtists(data);
    } catch (error) {
      console.error('Error fetching artists data:', error);
    }
  };

  useEffect(() => {
    fetchArtistsData();
  }, [page, search]);

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // Reset page when the search term changes
  };

  return (
    <div>
      <h1>Artists</h1>
      <input
        type="text"
        placeholder="Search by Name"
        value={search}
        onChange={handleSearchChange}
      />
      <div>
        {artists.map((artist) => (
          <ArtistCard key={artist.id} id={artist.id} name={artist.username} />
        ))}
      </div>
      <button onClick={handleLoadMore}>Load More</button>
    </div>
  );
};

export default ArtistList;
