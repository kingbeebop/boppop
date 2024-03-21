export interface Song {
    id: string;
    title: string;
    url: string;
    artist: string;
  }
  
export interface Playlist {
    id: number; // Assuming you have an ID field in your Playlist model
    number: number;
    theme: string;
    date: string; // You may want to use a specific date format here
    active: boolean;
    contest: boolean;
    winner: Song | null; // Assuming winner can be null or a Song object
    songs: Song[]; // Array of Song objects
}