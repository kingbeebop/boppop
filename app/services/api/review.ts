import { graphqlRequest } from '../fetch';
import { Review } from '../../types';

const REVIEW_FIELDS = `
  id
  content
  song {
    id
    title
    url
  }
  author {
    id
    username
    name
  }
  playlist {
    id
    number
  }
  created_at
  updated_at
`;

export async function getReviews(songId: number): Promise<Review[]> {
  const query = `
    query GetReviews($songId: ID!) {
      reviews(songId: $songId) {
        items {
          ${REVIEW_FIELDS}
        }
      }
    }
  `;
  return (await graphqlRequest<{ reviews: { items: Review[] } }>(query, { songId })).reviews.items;
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