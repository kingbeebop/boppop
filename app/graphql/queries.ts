import { gql } from '@apollo/client';

export const PLAYLISTS_QUERY = gql`
  query GetPlaylists($first: Int, $after: String, $filter: PlaylistFilter) {
    playlists(first: $first, after: $after, filter: $filter) {
      edges {
        node {
          id
          number
          theme
          date
          active
          contest
          songIds
          createdAt
          updatedAt
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
