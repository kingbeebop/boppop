import { graphqlRequest } from '../fetch';
import { Artist, ArtistResponse } from '../../types';

const ARTIST_FIELDS = `
  id
  name
  bio
  profilePic
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
}: GetArtistsParams = {}): Promise<ArtistResponse> {
  const query = `
    query GetArtists(
      $first: Int
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
    ...(search && { filter: { search } })
  };

  const response = await graphqlRequest<{ data: ArtistResponse }>(query, variables);
  return response.data;
}

export async function getArtist(id: number): Promise<Artist> {
  const query = `
    query GetArtist($id: ID!) {
      artist(id: $id) {
        ${ARTIST_FIELDS}
      }
    }
  `;

  const response = await graphqlRequest<{ artist: Artist }>(query, { id: id.toString() });
  return response.artist;
}