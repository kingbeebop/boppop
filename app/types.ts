export interface Song {
  id: number;
  title: string;
  url: string;
  artist: string;
}

export interface Artist {
  id: number;
  username: string;
  name: string | null;
  bio: string | null;
  profile_pic: string | null;
}

export interface ArtistResponse {
  items: Artist[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}
  
export interface Playlist {
  id: number;
  number: number;
  theme: string;
  date: string;
  active: boolean;
  contest: boolean;
  winner: Song | null;
  songs: Song[];
}

export interface PlaylistResponse {
  items: Playlist[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

export interface Login {
  username: string;
  password: string;
}

export interface Registration {
  username: string;
  password: string;
  password2: string;
  email: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: Artist;
}

export interface Submission {
  url: string;
  title: string;
}

export interface Ballot {
  songId: number | null;
  comments: string;
}

export interface Review {
  id: number;
  content: string;
  username: string;
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
  songId: number;
  comments: string;
}
