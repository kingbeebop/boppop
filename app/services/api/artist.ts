import { graphqlRequest } from '../fetch';
import { Artist, ArtistConnection, GetArtistsParams } from '../../types';

const ARTIST_FIELDS = `
  id
  name
  bio
  profilePic
  songIds
  createdAt
  updatedAt
`;

export async function fetchArtists({
  first = 10,
  after,
  search,
  sortBy,
  sortDirection,
}: GetArtistsParams = {}): Promise<ArtistConnection> {
  const query = `
    query GetArtists(
      $first: Int!
      $after: String
      $filter: ArtistFilter
    ) {
      artists(
        first: $first
        after: $after
        filter: $filter
      ) {
        edges {
          node {
            ${ARTIST_FIELDS}
          }
          cursor
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
        totalCount
      }
    }
  `;

  const variables = {
    first,
    after,
    ...(search && { 
      filter: { 
        search,
        sortBy,
        sortDirection 
      }
    })
  };

  const response = await graphqlRequest<{ artists: ArtistConnection }>(
    query,
    variables,
    true
  );
  return response.artists;
}

export async function fetchArtist(id: string): Promise<Artist | null> {
  const query = `
    query GetArtist($id: ID!) {
      artist(id: $id) {
        ${ARTIST_FIELDS}
      }
    }
  `;

  const response = await graphqlRequest<{ artist: Artist | null }>(
    query,
    { id },
    true
  );
  return response.artist;
}