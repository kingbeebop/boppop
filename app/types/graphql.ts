export interface SongSubmissionInput {
  title: string;
  url: string;
}

export interface Song {
  id: string;
  title: string;
  url: string;
  artistId: string;
  artistName: string;
}

export interface SubmitSongResponse {
  submitOrUpdateSong: Song;
}

export interface CurrentSubmissionResponse {
  currentSubmission: Song | null;
}

// Add other types as needed 