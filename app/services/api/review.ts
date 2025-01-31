import { graphqlRequest } from '../fetch';
import { Review } from '../../types';

const REVIEW_FIELDS = `
  id
  content
  song {
    id
    title
  }
  author {
    id
    name
  }
  createdAt
  updatedAt
`;

export async function getReviews(playlistId: string): Promise<Review[]> {
  const query = `
    query GetReviews($playlistId: ID!) {
      reviews(playlistId: $playlistId) {
        ${REVIEW_FIELDS}
      }
    }
  `;

  const response = await graphqlRequest<{ reviews: Review[] }>(
    query,
    { playlistId },
    true
  );
  return response.reviews;
}

export async function createReview(songId: number, content: string): Promise<Review> {
  const mutation = `
    mutation CreateReview($songId: ID!, $content: String!) {
      createReview(input: { songId: $songId, content: $content }) {
        ${REVIEW_FIELDS}
      }
    }
  `;
  return (await graphqlRequest<{ createReview: Review }>(
    mutation,
    { songId, content },
    true
  )).createReview;
} 