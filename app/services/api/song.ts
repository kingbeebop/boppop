import { graphqlRequest } from '../fetch';
import { Song } from '../../types';

const SONG_FIELDS = `
  id
  title
  url
  artistId
  artistName
`;

export async function getSongsByIds(ids: string[]): Promise<Song[]> {
  const query = `
    query GetSongs($ids: [ID!]!) {
      songsByIds(ids: $ids) {
        ${SONG_FIELDS}
      }
    }
  `;

  const response = await graphqlRequest<{ songsByIds: Song[] }>(
    query,
    { ids },
    true
  );
  return response.songsByIds;
}

export async function getSong(id: string): Promise<Song> {
  const query = `
    query GetSong($id: ID!) {
      song(id: $id) {
        ${SONG_FIELDS}
      }
    }
  `;

  const response = await graphqlRequest<{ song: Song }>(query, { id });
  return response.song;
}
// import { graphqlRequest } from '../fetch';
// import { Song } from '../../types';

// const SONG_FIELDS = `
//   id
//   title
//   url
//   artist {
//     id
//     username
//     name
//   }
//   playlist {
//     id
//     number
//     theme
//   }
//   created_at
//   updated_at
// `;

// interface SongResponse {
//     items: Song[];
//     totalItems: number;
//     totalPages: number;
//     currentPage: number;
//     hasNext: boolean;
//     hasPrev: boolean;
//   }

// interface GetSongsParams {
//   page?: number;
//   limit?: number;
//   sortBy?: 'title' | 'created_at';
//   sortDirection?: 'asc' | 'desc';
//   artistId?: number;
//   playlistId?: number;
//   search?: string;
// }

// export async function getSong(id: number): Promise<Song> {
//   const query = `
//     query GetSong($id: ID!) {
//       song(id: $id) {
//         ${SONG_FIELDS}
//       }
//     }
//   `;
//   return (await graphqlRequest<{ song: Song }>(query, { id })).song;
// }

// export async function getSongs({
//   page = 1,
//   limit = 10,
//   search = '',
//   artistId,
//   playlistId
// }: GetSongsParams): Promise<SongResponse> {
//   const query = `
//     query GetSongs($page: Int!, $limit: Int!, $search: String, $artistId: ID, $playlistId: ID) {
//       songs(
//         page: $page
//         limit: $limit
//         search: $search
//         artistId: $artistId
//         playlistId: $playlistId
//       ) {
//         items {
//           ${SONG_FIELDS}
//         }
//         pageInfo {
//           totalItems
//           totalPages
//           currentPage
//         }
//       }
//     }
//   `;

//   const response = await graphqlRequest<{
//     songs: {
//       items: Song[];
//       pageInfo: {
//         totalItems: number;
//         totalPages: number;
//         currentPage: number;
//       };
//     };
//   }>(query, {
//     page,
//     limit,
//     search,
//     artistId,
//     playlistId,
//   });

//   return {
//     items: response.songs.items,
//     totalItems: response.songs.pageInfo.totalItems,
//     totalPages: response.songs.pageInfo.totalPages,
//     currentPage: response.songs.pageInfo.currentPage,
//     hasNext: response.songs.pageInfo.currentPage < response.songs.pageInfo.totalPages,
//     hasPrev: response.songs.pageInfo.currentPage > 1
//   };
// }