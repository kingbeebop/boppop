// api.ts
const apiUrl = 'http://localhost:8000/api';

const baseFetch = async (url: string, options?: RequestInit) => {
  const response = await fetch(`${apiUrl}${url}`, {
    credentials: 'include',
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch data from ${url}`);
  }

  return response.json();
};

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

  export const fetchArtists = async (
    limit: number = 10,
    page: number = 1,
    search: string = ''
  ) => {
    const queryParams = new URLSearchParams({
      limit: String(limit),
      page: String(page),
      search,
    });
    
    const url = `/artists/?${queryParams.toString()}`;
  
    const response = await baseFetch(url);  // Assuming you have a baseFetch function as mentioned in the previous response
  
    if (!response.ok) {
      throw new Error('Failed to fetch artists data');
    }
  
    return response.json();
  };

  
export const fetchArtist = async (artistId: string) => {
    const response = await fetch(`${apiUrl}/artists/${artistId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch artist data');
    }
  
    return response.json();
  };

export const fetchArtistSongs = async (artistName: string) => {
    const response = await fetch(`${apiUrl}/artists/${encodeURIComponent(artistName)}/songs`);
    if (!response.ok) {
      throw new Error('Failed to fetch artist songs');
    }
  
    return response.json();
  };

export const fetchCurrentPlaylist = async () => {
    const response = await fetch(`${apiUrl}/playlists/current/`);
    if (!response.ok) {
      throw new Error('Failed to fetch current playlist data');
    }
  
    return response.json();
  };

export const fetchSubmission = async () => {
    const response = await fetch(`${apiUrl}/submission/`);
    if (!response.ok) {
      throw new Error('Failed to fetch submission data');
    }
  
    return response.json();
  };

interface SubmissionData {
    url: string;
    title: string;
  }

export const submitOrUpdateSubmission = async (data: SubmissionData) => {
    const response = await fetch(`${apiUrl}/submit/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  
    if (!response.ok) {
      throw new Error('Failed to submit or update submission');
    }
  
    return response.json();
  };

export const fetchContestPlaylist = async () => {
    const response = await fetch(`${apiUrl}/playlists/current/id`);
    if (!response.ok) {
      throw new Error('Failed to fetch contest playlist data');
    }
  
    return response.json();
  };

  interface VoteReviewData {
    id: string;
    review: string;
  }
  
export const submitVoteAndReview = async (data: VoteReviewData) => {
    const response = await fetch(`${apiUrl}/vote/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  
    if (!response.ok) {
      throw new Error('Failed to submit vote and review');
    }
  
    return response.json();
  };