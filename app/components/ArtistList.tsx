// components/ArtistList.tsx

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { fetchArtistsAsync } from '../redux/slices/artistSlice';
import ArtistCard from './ArtistCard';
import { Artist } from '../types';

const ArtistList: React.FC = () => {
  const dispatch = useDispatch<any>();
  const { artists, loading, error, currentPage, limit, search } = useSelector(
    (state: RootState) => state.artist
  );

  useEffect(() => {
    dispatch(fetchArtistsAsync({ limit, page: currentPage, search }));
    console.log(artists)
  }, [dispatch, currentPage, limit, search]);

  return (
    <div>
      <h1 className="centered-title">Artists</h1>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <div>
          {artists.map((artist: Artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ArtistList;
