export interface Song {
  id: string;
  title: string;
  url: string;
  artist: string;
}

export interface Artist {
  id: number;
  name: string;
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