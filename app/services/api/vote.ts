import { graphqlRequest } from '../fetch';
import { Vote, Ballot } from '../../types';

const VOTE_FIELDS = `
  id
  song {
    id
    title
  }
  artist {
    id
    username
  }
  playlist {
    id
    number
  }
  created_at
`;

export async function submitVote(songId: number): Promise<Vote> {
  const mutation = `
    mutation SubmitVote($songId: ID!) {
      submitVote(input: { songId: $songId }) {
        ${VOTE_FIELDS}
      }
    }
  `;
  return (await graphqlRequest<{ submitVote: Vote }>(
    mutation,
    { songId },
    true
  )).submitVote;
}

export async function submitVoteAndReview(ballot: Ballot): Promise<Vote> {
  const mutation = `
    mutation SubmitVoteAndReview($songId: ID!, $comments: String!) {
      submitVoteAndReview(input: { 
        songId: $songId, 
        comments: $comments 
      }) {
        ${VOTE_FIELDS}
        review {
          id
          content
        }
      }
    }
  `;
  return (await graphqlRequest<{ submitVoteAndReview: Vote }>(
    mutation,
    { 
      songId: ballot.songId,
      comments: ballot.comments
    },
    true
  )).submitVoteAndReview;
} 