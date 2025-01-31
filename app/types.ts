export interface Song {
  id: string;
  title: string;
  url: string;
  artistId: string;
  artistName: string;
}

export interface Artist {
  id: string;
  name: string;
  bio?: string;
  profilePic?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: number;
  email: string;
  username: string;
  is_active: boolean;
  is_superuser: boolean;
  artistId?: number;
}

export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
  endCursor: string | null;
}

export interface ArtistEdge {
  node: Artist;
  cursor: string;
}

export interface ArtistConnection {
  edges: ArtistEdge[];
  pageInfo: PageInfo;
  totalCount: number;
}

export interface ArtistResponse {
  artists: ArtistConnection;
}

export interface Playlist {
  id: string;
  number: number;
  theme: string;
  date: string;
  active: boolean;
  contest: boolean;
  songIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PlaylistEdge {
  node: Playlist;
  cursor: string;
}

export interface PlaylistConnection {
  edges: PlaylistEdge[];
  pageInfo: PageInfo;
  totalCount: number;
}

export interface PlaylistResponse {
  playlists: PlaylistConnection;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface Login {
  username: string;
  password: string;
}

export interface Registration {
  email: string;
  password: string;
  username: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface Submission {
  url: string;
  title: string;
}

export interface SubmissionResponse {
  items: Submission[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

export interface Vote {
  songId: string;
  playlistId: string;
  comments: string;
}

export interface Ballot {
  songId: string | null;
  playlistId: string;
  comments: string;
}

export interface Review {
  id: number;
  content: string;
  songId: number;
  artistId: number;
  created_at: string;
}

export interface ApiError {
  message: string;
  status: number;
}
