// api.ts
const apiUrl = 'http://localhost:8000/api';

// const baseFetch = async (url: string, options?: RequestInit) => {
//   console.log('Fetching:', `${apiUrl}${url}`);
//   const response = await fetch(`${apiUrl}${url}`, {
//     credentials: 'include',
//     ...options,
//   });

//   if (!response.ok) {
//     throw new Error(`Failed to fetch data from ${url}`);
//   }

//   return response.json();
// };

// const apiRequest = async (url: string) => {
//   const response = await baseFetch(url);

//   if (!response.ok) {
//     throw new Error(`Failed to fetch data from ${url}`);
//   }

//   return response.json();
// };
const baseFetch = async (url: string, options?: RequestInit) => {
  const response = await fetch(`${apiUrl}${url}`, {
    // credentials: 'include',
    mode: 'cors', // Add this line
    credentials: 'include',
    ...options,
  });

  if (!response.ok) {
    console.log(response)
    throw new Error(`Failed to fetch data from ${url}`);
  }

  return response.json();
};

const apiRequest = async (url: string) => {
  const response = await baseFetch(url);

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
  return apiRequest(`/playlists/${playlistId}`);
};

export const fetchPlaylists = async (
  limit: number,
  page: number,
  search: string
) => {
  const queryParams = new URLSearchParams({
    limit: String(limit),
    page: String(page),
    search,
  });

  return apiRequest(`/playlists/?${queryParams.toString()}`);
};

// export const fetchArtists = async (
//   limit: number = 10,
//   page: number = 1,
//   search: string = ''
// ) => {
//   const queryParams = new URLSearchParams({
//     limit: String(limit),
//     page: String(page),
//     search,
//   });

//   return apiRequest(`/artists?${queryParams.toString()}`);
// };
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

  return apiRequest(`/artists/?${queryParams.toString()}`);

};

export const fetchArtist = async (artistId: string) => {
  return apiRequest(`/artists/${artistId}`);
};

export const fetchArtistSongs = async (artistName: string) => {
  return apiRequest(`/artists/${encodeURIComponent(artistName)}/songs`);
};

export const fetchCurrentPlaylist = async () => {
  return apiRequest('/playlists/current/');
};

export const fetchSubmission = async () => {
  return apiRequest('/submission/');
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
  return apiRequest('/playlists/current/id');
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