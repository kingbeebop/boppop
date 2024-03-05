// api.ts
const apiUrl = 'http://localhost:8000/api';

export const loginRequest = async (username: string, password: string) => {
  // Implement your login request logic
};

export const registerRequest = async (
  username: string,
  password1: string,
  password2: string
) => {
  // Implement your register request logic
};

export const forgotPasswordRequest = async (username: string) => {
  // Implement your forgot password request logic
};

export const fetchPlaylist = async (playlistId: string) => {
    const response = await fetch(`${apiUrl}/playlists/${playlistId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch playlist data');
    }
  
    return response.json();
  };

export const fetchPlaylists = async (limit: number, page: number, search?: string) => {
    const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
    const response = await fetch(`${apiUrl}/playlists?limit=${limit}&page=${page}${searchParam}`);
    if (!response.ok) {
      throw new Error('Failed to fetch playlists data');
    }
  
    return response.json();
  };