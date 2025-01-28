import { graphqlRequest } from '../fetch';
import { Playlist, PlaylistResponse } from '../../types';

const PLAYLIST_FIELDS = `
  id
  number
  theme
  date
  active
  contest
  songIds
  winnerId
  createdAt
  updatedAt
`;

export interface GetPlaylistsParams {
  first?: number;
  after?: string;
  search?: string;
  sortBy?: 'DATE' | 'NUMBER' | 'THEME';
  sortDirection?: 'ASC' | 'DESC';
}

export async function getPlaylists({
  first = 10,
  after,
  search,
  sortBy,
  sortDirection,
}: GetPlaylistsParams = {}): Promise<PlaylistResponse> {
  const query = `
    query GetPlaylists(
      $first: Int
      $after: String
      $filter: PlaylistFilter
    ) {
      playlists(
        first: $first
        after: $after
        filter: $filter
      ) {
        edges {
          node {
            ${PLAYLIST_FIELDS}
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
    filter: search ? {
      search,
      sortBy,
      sortDirection
    } : undefined
  };

  const response = await graphqlRequest<{ data: PlaylistResponse }>(query, variables);
  return response.data;
}

export async function getPlaylist(id: number): Promise<Playlist> {
  const query = `
    query GetPlaylist($id: ID!) {
      playlist(id: $id) {
        ${PLAYLIST_FIELDS}
      }
    }
  `;

  const response = await graphqlRequest<{ playlist: Playlist }>(query, { id: id.toString() });
  return response.playlist;
}