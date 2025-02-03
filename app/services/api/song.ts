import { graphqlRequest } from '../fetch';
import { Song } from '../../types';

const SONG_FIELDS = `
  id
  title
  url
  artist {
    id
    name
  }
`;

export async function fetchSongs(ids: string[]): Promise<Song[]> {
  const query = `
    query GetSongsByIds($ids: [String!]!) {
      songs_by_ids(ids: $ids) {
        ${SONG_FIELDS}
      }
    }
  `;

  const response = await graphqlRequest<{ songs_by_ids: Song[] }>(query, { ids });
  return response.songs_by_ids;
}

export async function fetchSong(id: string): Promise<Song> {
  const query = `
    query GetSong($id: String!) {
      song(id: $id) {
        ${SONG_FIELDS}
      }
    }
  `;

  const response = await graphqlRequest<{ song: Song }>(query, { id });
  return response.song;
}

interface SongsFilter {
  artistId?: string;
  search?: string;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
}

interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string;
  endCursor: string;
}

interface SongsConnection {
  edges: {
    node: Song;
    cursor: string;
  }[];
  pageInfo: PageInfo;
}

export async function getSongs(
  first: number = 10,
  after?: string,
  filter?: SongsFilter
): Promise<SongsConnection> {
  const query = `
    query GetSongs($first: Int!, $after: String, $filter: SongFilter) {
      songs(first: $first, after: $after, filter: $filter) {
        edges {
          node {
            ${SONG_FIELDS}
          }
          cursor
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
  `;

  const response = await graphqlRequest<{ songs: SongsConnection }>(
    query,
    { first, after, filter }
  );
  return response.songs;
}