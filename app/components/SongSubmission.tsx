import React, { useState } from 'react';
import { gql } from 'graphql-request';
import { createGraphQLClient, withAuth } from '../lib/graphql';
import { Song, SongSubmissionInput, SubmitSongResponse } from '../types/graphql';

const SUBMIT_SONG_MUTATION = gql`
  mutation SubmitOrUpdateSong($input: SongSubmissionInput!) {
    submitOrUpdateSong(input: $input) {
      id
      title
      url
      artistId
      artistName
    }
  }
`;

export const submitSong = async (input: SongSubmissionInput): Promise<SubmitSongResponse> => {
  return withAuth(async () => {
    const client = createGraphQLClient();
    return client.request<SubmitSongResponse>(SUBMIT_SONG_MUTATION, { input });
  });
};

interface SongSubmissionProps {
  onSubmit?: (song: Song) => void;
  onError?: (error: Error) => void;
}

export const SongSubmission: React.FC<SongSubmissionProps> = ({ onSubmit, onError }) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await submitSong({ title, url });
      setTitle('');
      setUrl('');
      onSubmit?.(response.submitOrUpdateSong);
    } catch (error) {
      onError?.(error as Error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col">
        <label htmlFor="title" className="text-sm font-medium mb-1">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="border rounded-md p-2"
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="url" className="text-sm font-medium mb-1">
          URL
        </label>
        <input
          id="url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          className="border rounded-md p-2"
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
      >
        {submitting ? 'Submitting...' : 'Submit Song'}
      </button>
    </form>
  );
}; 