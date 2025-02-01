export interface PlaylistFilter {
  theme?: string;
  search?: string;
  active?: boolean;
  contest?: boolean;
}

export interface Playlist {
  id: string;
  number: number;
  theme: string;
  date: string;
  active: boolean;
  contest: boolean;
  winnerId?: string;
  songIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PlaylistEdge {
  node: Playlist;
  cursor: string;
}

export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: string;
  endCursor?: string;
}

export interface PlaylistConnection {
  edges: PlaylistEdge[];
  pageInfo: PageInfo;
  totalCount: number;
} 