import { graphqlRequest } from '../fetch';
import { Playlist, Submission, Song } from '../../types';

const CHALLENGE_FIELDS = `
  id
  number
  theme
  date
  active
  contest
  songIds
  createdAt
  updatedAt
`;

export async function getChallenge(): Promise<Playlist> {
  const query = `
    query GetChallenge {
      currentChallenge {
        ${CHALLENGE_FIELDS}
      }
    }
  `;
  const response = await graphqlRequest<{ currentChallenge: Playlist }>(query, {}, true);
  console.log('Raw GraphQL response:', response);  // Debug log
  
  if (!response.currentChallenge) {
    throw new Error('No challenge data received');
  }
  
  return response.currentChallenge;
}

export async function getLastChallenge(): Promise<Playlist> {
  const query = `
    query GetLastChallenge {
      lastChallenge {
        ${CHALLENGE_FIELDS}
      }
    }
  `;
  return (await graphqlRequest<{ lastChallenge: Playlist }>(query, {}, true)).lastChallenge;
}

// export async function getSubmission(): Promise<Song | null> {
//   const query = `
//     query GetSubmission {
//       currentSubmission {
//         id
//         title
//         url
//         artistId
//         artistName
//       }
//     }
//   `;
//   return (await graphqlRequest<{ currentSubmission: Song | null }>(query, {}, true)).currentSubmission;
// }

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