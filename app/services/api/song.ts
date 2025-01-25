import { graphqlRequest } from '../fetch';
import { Song } from '../../types';

const SONG_FIELDS = `
  id
  title
  url
  artist {
    id
    username
  }
  playlist {
    id
    number
  }
`;

interface SongResponse {
    items: Song[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
  }

interface GetSongsParams {
  page?: number;
  limit?: number;
  sortBy?: 'title' | 'created_at';
  sortDirection?: 'asc' | 'desc';
  artistId?: number;
  playlistId?: number;
  search?: string;
}

export async function getSong(id: number): Promise<Song> {
  const query = `
    query GetSong($id: ID!) {
      song(id: $id) {
        ${SONG_FIELDS}
      }
    }
  `;
  return (await graphqlRequest<{ song: Song }>(query, { id })).song;
}

export async function getSongs({
  page = 1,
  limit = 10,
  sortBy = 'created_at',
  sortDirection = 'desc',
  artistId,
  playlistId,
  search,
}: GetSongsParams = {}): Promise<SongResponse> {
  const query = `
    query GetSongs(
      $page: Int
      $limit: Int
      $sortBy: String
      $sortDirection: String
      $artistId: ID
      $playlistId: ID
      $search: String
    ) {
      songs(
        page: $page
        limit: $limit
        sortBy: $sortBy
        sortDirection: $sortDirection
        filter: {
          artistId: $artistId
          playlistId: $playlistId
          search: $search
        }
      ) {
        items {
          ${SONG_FIELDS}
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
    songs: {
      items: Song[];
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
    artistId,
    playlistId,
    search,
  });

  return {
    items: response.songs.items,
    totalItems: response.songs.pageInfo.totalItems,
    totalPages: response.songs.pageInfo.totalPages,
    currentPage: response.songs.pageInfo.currentPage
  };
}