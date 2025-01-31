import { graphqlRequest } from '../fetch';
import { Song } from '../../types';

const SUBMISSION_FIELDS = `
  id
  title
  url
  artistId
  artistName
`;

export async function getSubmission(): Promise<Song | null> {
  const query = `
    query GetSubmission {
      currentSubmission {
        ${SUBMISSION_FIELDS}
      }
    }
  `;
  
  const response = await graphqlRequest<{ currentSubmission: Song | null }>(query, {}, true);
  return response.currentSubmission;
}

export async function submitOrUpdateSubmission(data: { title: string; url: string }): Promise<Song> {
  const mutation = `
    mutation SubmitOrUpdateSong($input: SongSubmissionInput!) {
      submitOrUpdateSong(input: $input) {
        ${SUBMISSION_FIELDS}
      }
    }
  `;

  const response = await graphqlRequest<{ submitOrUpdateSong: Song }>(
    mutation,
    { input: data },
    true
  );
  return response.submitOrUpdateSong;
}