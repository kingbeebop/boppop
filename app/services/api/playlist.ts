import { graphqlRequest } from '../fetch';
import { Playlist, PlaylistConnection } from '../../types';

const PLAYLIST_FIELDS = `
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

export interface GetPlaylistsParams {
  first?: number;
  after?: string;
  filter?: {
    active?: boolean;
    search?: string;
    sortBy?: 'DATE' | 'NUMBER' | 'THEME';
    sortDirection?: 'ASC' | 'DESC';
  };
}

export async function getPlaylists({
  first = 10,
  after,
  filter,
}: GetPlaylistsParams = {}): Promise<PlaylistConnection> {
  const query = `
    query GetPlaylists(
      $first: Int!
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

  const response = await graphqlRequest<{ playlists: PlaylistConnection }>(
    query,
    { first, after, filter },
    true
  );
  return response.playlists;
}

export async function getPlaylist(id: string): Promise<Playlist> {
  const query = `
    query GetPlaylist($id: ID!) {
      playlist(id: $id) {
        ${PLAYLIST_FIELDS}
      }
    }
  `;

  const response = await graphqlRequest<{ playlist: Playlist }>(
    query,
    { id },
    true
  );
  return response.playlist;
}