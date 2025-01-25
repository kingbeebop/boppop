

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPlaylists, selectPlaylists } from '../redux/slices/playlistSlice';
import ChallengeList from './ChallengeList';

const Archive: React.FC = () => {
  const dispatch = useDispatch<any>();
  const { loading, error, currentPage, limit, search, count } = useSelector(selectPlaylists);
  const [searchTerm, setSearchTerm] = useState('');
  const totalPages = Math.ceil(count / limit);

  useEffect(() => {
    dispatch(fetchPlaylists({ limit, page: 1, search }));
  }, [dispatch, limit, search]);

  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      dispatch(fetchPlaylists({ limit, page: currentPage + 1, search }));
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = () => {
    dispatch(fetchPlaylists({ limit, page: 1, search: searchTerm }));
  };

  return (
    <div>
      <h1 className="centered-title">Bop Pop Archive</h1>
      <input
        type="text"
        placeholder="Search by ID or Theme"
        value={searchTerm}
        onChange={handleSearchChange}
        style = {{color: 'black'}}
      />
      <button onClick={handleSearchSubmit}>Search</button>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <React.Fragment>
          <ChallengeList />
          {currentPage < totalPages && (
            <button onClick={handleLoadMore}>Load More</button>
          )}
        </React.Fragment>
      )}
    </div>
  );
};

export default Archive;