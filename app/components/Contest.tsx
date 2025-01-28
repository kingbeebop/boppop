import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { getContestData, submitBallot, setBallot } from '../redux/slices/contestSlice';
import VoteCard from './VoteCard';
import { Ballot, Song } from '../types';

const Contest: React.FC = () => {
  const dispatch = useDispatch<any>();
  const { loading, error, playlist, ballot } = useSelector((state: RootState) => state.contest);
  const [comment, setComment] = useState(ballot?.comments || '');

  useEffect(() => {
    dispatch(getContestData());
  }, [dispatch]);

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
    dispatch(setBallot({ ...ballot, comments: e.target.value }));
  };

  const handleRadialSelect = (selectedSong: Song) => {
    dispatch(setBallot({ ...ballot, songId: selectedSong.id }));
  };

  const handleSubmit = () => {
    dispatch(submitBallot());
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const songIds = playlist?.songIds || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h3 className="text-2xl font-bold mb-4">
        {playlist?.theme}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {songIds.map((songId) => (
          <VoteCard
            key={songId}
            songId={songId}
            playlistId={playlist?.id || ''}
          />
        ))}
      </div>
      <div className="mt-4">
        <label htmlFor="comment">Comments:</label>
        <textarea
          id="comment"
          value={comment}
          onChange={handleCommentChange}
          className="block w-full p-2 border rounded"
          rows={4}
        />
      </div>
      <button onClick={handleSubmit} className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Submit
      </button>
    </div>
  );
};

export default Contest;
