import { graphqlRequest } from '../fetch';
import { Playlist, Ballot } from '../../types';

const CONTEST_FIELDS = `
  id
  number
  theme
  date
  active
  contest
  songs {
    id
    title
    url
    artist {
      id
      username
    }
  }
`;

export async function getContest(): Promise<Playlist> {
  const query = `
    query GetContest {
      currentContest {
        ${CONTEST_FIELDS}
      }
    }
  `;
  return (await graphqlRequest<{ currentContest: Playlist }>(query, {}, true)).currentContest;
}

export async function submitBallot(ballot: Ballot): Promise<void> {
  const mutation = `
    mutation SubmitBallot($songId: ID!, $comments: String!) {
      submitBallot(input: {
        songId: $songId
        comments: $comments
      }) {
        id
      }
    }
  `;
  
  await graphqlRequest(
    mutation,
    {
      songId: ballot.songId,
      comments: ballot.comments
    },
    true
  );
} 