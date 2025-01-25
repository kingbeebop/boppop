import { graphqlRequest } from '../fetch';
import { Artist, ArtistResponse } from '../../types';

interface GetArtistsParams {
  page?: number;
  limit?: number;
  sortBy?: 'username' | 'created_at';
  sortDirection?: 'asc' | 'desc';
  isActive?: boolean;
  search?: string;
  hasSongs?: boolean;
}

const ARTIST_FIELDS = `
  id
  username
  name
  bio
  profile_pic
`;

export async function getArtist(id: number): Promise<Artist> {
  const query = `
    query GetArtist($id: ID!) {
      artist(id: $id) {
        ${ARTIST_FIELDS}
      }
    }
  `;
  return (await graphqlRequest<{ artist: Artist }>(query, { id })).artist;
}

export async function getArtists({
  page = 1,
  limit = 10,
  sortBy = 'username',
  sortDirection = 'asc',
  isActive,
  search,
  hasSongs,
}: GetArtistsParams = {}): Promise<ArtistResponse> {
  const query = `
    query GetArtists(
      $page: Int
      $limit: Int
      $sortBy: String
      $sortDirection: String
      $isActive: Boolean
      $search: String
      $hasSongs: Boolean
    ) {
      artists(
        page: $page
        limit: $limit
        sortBy: $sortBy
        sortDirection: $sortDirection
        filter: {
          isActive: $isActive
          search: $search
          hasSongs: $hasSongs
        }
      ) {
        items {
          ${ARTIST_FIELDS}
        }
        pageInfo {
          totalItems
          totalPages
          currentPage
        }
      }
    }
  `;

  const response = await graphqlRequest<{
    artists: {
      items: Artist[];
      pageInfo: {
        totalItems: number;
        totalPages: number;
        currentPage: number;
      };
    };
  }>(query, {
    page,
    limit,
    sortBy,
    sortDirection,
    isActive,
    search,
    hasSongs,
  });

  return {
    items: response.artists.items,
    totalItems: response.artists.pageInfo.totalItems,
    totalPages: response.artists.pageInfo.totalPages,
    currentPage: response.artists.pageInfo.currentPage
  };
}