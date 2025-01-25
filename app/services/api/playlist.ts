import { graphqlRequest } from '../fetch';
import { Playlist, PlaylistResponse } from '../../types';

interface PlaylistFilters {
  active?: boolean;
  contest?: boolean;
  search?: string;
  startDate?: string;
  endDate?: string;
}

interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: 'date' | 'number';
  sortDirection?: 'asc' | 'desc';
}


const PLAYLIST_FIELDS = `
  id
  number
  theme
  date
  active
  contest
  winner {
    id
    title
  }
  songs {
    id
    title
    artist {
      username
    }
  }
`;

export async function getPlaylist(id: number): Promise<Playlist> {
  const query = `
    query GetPlaylist($id: ID!) {
      playlist(id: $id) {
        ${PLAYLIST_FIELDS}
      }
    }
  `;
  return (await graphqlRequest<{ playlist: Playlist }>(query, { id })).playlist;
}

export async function getCurrentPlaylist(): Promise<Playlist> {
  const query = `
    query GetCurrentPlaylist {
      currentPlaylist {
        ${PLAYLIST_FIELDS}
      }
    }
  `;
  return (await graphqlRequest<{ currentPlaylist: Playlist }>(query)).currentPlaylist;
}

interface GetPlaylistsParams {
  page?: number;
  limit?: number;
  sortBy?: 'date' | 'number';
  sortDirection?: 'asc' | 'desc';
  active?: boolean;
  contest?: boolean;
  search?: string;
  startDate?: string;
  endDate?: string;
}

export async function getPlaylists({
  page = 1,
  limit = 10,
  sortBy = 'date',
  sortDirection = 'desc',
  active,
  contest,
  search,
  startDate,
  endDate,
}: GetPlaylistsParams = {}): Promise<PlaylistResponse> {
  const query = `
    query GetPlaylists(
      $page: Int
      $limit: Int
      $sortBy: String
      $sortDirection: String
      $active: Boolean
      $contest: Boolean
      $search: String
      $startDate: String
      $endDate: String
    ) {
      playlists(
        page: $page
        limit: $limit
        sortBy: $sortBy
        sortDirection: $sortDirection
        filter: {
          active: $active
          contest: $contest
          search: $search
          startDate: $startDate
          endDate: $endDate
        }
      ) {
        items {
          ${PLAYLIST_FIELDS}
        }
        pageInfo {
          totalItems
          totalPages
          currentPage
        }
      }
    }
  `;

  const variables = {
    page,
    limit,
    sortBy,
    sortDirection,
    active,
    contest,
    search,
    startDate,
    endDate,
  };

  const response = await graphqlRequest<{
    playlists: {
      items: Playlist[];
      pageInfo: {
        totalItems: number;
        totalPages: number;
        currentPage: number;
      };
    };
  }>(query, variables);

  return {
    items: response.playlists.items,
    totalItems: response.playlists.pageInfo.totalItems,
    totalPages: response.playlists.pageInfo.totalPages,
    currentPage: response.playlists.pageInfo.currentPage
  };
}