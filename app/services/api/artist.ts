import { graphqlRequest } from '../fetch';
import { Artist, ArtistConnection } from '../../types';

const ARTIST_FIELDS = `
  id
  name
  bio
  profilePic
  songIds
  createdAt
  updatedAt
`;

export interface GetArtistsParams {
  first?: number;
  after?: string;
  search?: string;
  sortBy?: 'NAME';
  sortDirection?: 'ASC' | 'DESC';
}

export async function getArtists({
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

export async function getArtist(id: string): Promise<Artist> {
  const query = `
    query GetArtist($id: ID!) {
      artist(id: $id) {
        ${ARTIST_FIELDS}
      }
    }
  `;

  const response = await graphqlRequest<{ artist: Artist }>(
    query,
    { id },
    true
  );
  return response.artist;
}