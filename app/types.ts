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

export interface LoginData {
  username: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: Artist;
}

export interface SubmissionData {
  url: string;
  title: string;
}

export interface Ballot {
  songId: number | null;
  comments: string;
}