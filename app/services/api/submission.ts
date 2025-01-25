import { graphqlRequest } from '../fetch';
import { Song, Submission } from '../../types';

const SUBMISSION_FIELDS = `
  id
  title
  url
  artist {
    id
    username
  }
`;

export async function getSubmission(): Promise<Song | null> {
  const query = `
    query GetSubmission {
      currentSubmission {
        ${SUBMISSION_FIELDS}
      }
    }
  `;
  
  const response = await graphqlRequest<{ currentSubmission: Song | null }>(
    query,
    {},
    true
  );
  return response.currentSubmission;
}

export async function submitOrUpdateSubmission(data: Submission): Promise<Song> {
  const mutation = `
    mutation SubmitOrUpdateSong($url: String!, $title: String!) {
      submitOrUpdateSong(input: { url: $url, title: $title }) {
        ${SUBMISSION_FIELDS}
      }
    }
  `;

  const response = await graphqlRequest<{ submitOrUpdateSong: Song }>(
    mutation,
    data,
    true
  );
  return response.submitOrUpdateSong;
}