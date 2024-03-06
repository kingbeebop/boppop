// components/Archive.tsx
import React, { useState, useEffect } from 'react';
import { fetchPlaylists } from '../utils/api';
import PlaylistList from './PlaylistList';

const Archive: React.FC = () => {
  const [playlists, setPlaylists] = useState<{ id: string; theme: string }[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const fetchPlaylistsData = async () => {
    try {
      const data = await fetchPlaylists(10, page, search);
      setPlaylists(data.results);
    } catch (error) {
      console.error('Error fetching playlists data:', error);
    }
  };

  useEffect(() => {
    fetchPlaylistsData();
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
      <h1>Bop Pop Archive</h1>
      <input
        type="text"
        placeholder="Search by ID or Theme"
        value={search}
        onChange={handleSearchChange}
      />
      <PlaylistList playlists={playlists} />
      <button onClick={handleLoadMore}>Load More</button>
    </div>
  );
};

export default Archive;
