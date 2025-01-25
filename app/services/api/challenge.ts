import { graphqlRequest } from '../fetch';
import { Playlist, Submission } from '../../types';

const CHALLENGE_FIELDS = `
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
      username
    }
  }
`;

export async function getChallenge(): Promise<Playlist> {
  const query = `
    query GetChallenge {
      currentChallenge {
        ${CHALLENGE_FIELDS}
      }
    }
  `;
  return (await graphqlRequest<{ currentChallenge: Playlist }>(query, {}, true)).currentChallenge;
}

export async function submitSong(data: Submission): Promise<void> {
  const mutation = `
    mutation SubmitSong($url: String!, $title: String!) {
      submitSong(input: { url: $url, title: $title }) {
        id
      }
    }
  `;
  await graphqlRequest(mutation, data, true);
} 