export interface Ballot {
  songId: string | null;
  playlistId: string | null;
  comments: string;
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