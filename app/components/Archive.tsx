import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { fetchPlaylistsAsync, selectPlaylists } from '../redux/slices/playlistSlice';
import PlaylistList from './PlaylistList';
import { Playlist } from '../types';

const Archive: React.FC = () => {
  const dispatch = useDispatch<any>();
  const { playlists, loading, error, currentPage, limit, search, count } = useSelector(selectPlaylists);
  const [searchTerm, setSearchTerm] = useState('');
  const totalPages = Math.ceil(count / limit);

  useEffect(() => {
    dispatch(fetchPlaylistsAsync({ limit, page: 1, search }));
  }, [dispatch, limit, search]);

  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      dispatch(fetchPlaylistsAsync({ limit, page: currentPage + 1, search }));
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = () => {
    dispatch(fetchPlaylistsAsync({ limit, page: 1, search: searchTerm }));
  };

  return (
    <div>
      <h1>Bop Pop Archive</h1>
      <input
        type="text"
        placeholder="Search by ID or Theme"
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <button onClick={handleSearchSubmit}>Search</button>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <React.Fragment>
          <PlaylistList playlists={playlists} />
          {currentPage < totalPages && (
            <button onClick={handleLoadMore}>Load More</button>
          )}
        </React.Fragment>
      )}
    </div>
  );
};

export default Archive;