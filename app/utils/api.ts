// api.ts
const apiUrl = 'http://localhost:8000/api';

const baseFetch = async (url: string, options?: RequestInit) => {
  const response = await fetch(`${apiUrl}${url}`, {
    mode: 'cors',
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
  try {
    const response = await fetch(`${apiUrl}/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      return data; // Return response data if needed
    } else {
      throw new Error('Invalid credentials');
    }
  } catch (error: any) {
    console.error('Login error:', error.message);
    throw error;
  }
};

export const logoutRequest = async () => {
  const response = await fetch(`${apiUrl}/logout/`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to logout');
  }
};

export const registerRequest = async (
  username: string,
  password1: string,
  password2: string,
  email: string
) => {
  const response = await fetch(`${apiUrl}/register/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password1, password2, email }),
  });

  if (!response.ok) {
    throw new Error('Failed to register');
  }
};

export const forgotPasswordRequest = async (username: string) => {
  // Implement your forgot password request logic
};

export const fetchPlaylist = async (playlistId: string) => {
  return apiRequest(`/playlists/${playlistId}`);
};

export const fetchPlaylists = async (
  limit: number = 10,
  page: number = 1,
  search: string = ''
) => {
  const apiUrl = 'http://localhost:8000/api'; // You can move this to a global config if needed
  const url = `${apiUrl}/playlists/?limit=${limit}&page=${page}&search=${search}`;

  console.log('Fetching Playlists:', url);

  try {
    const response = await fetch(url, {
      mode: 'cors', // Add this line
      credentials: 'include',
    });

    if (!response.ok) {
      console.error('Error fetching playlists data:', response);
      throw new Error(`Failed to fetch data from ${url}`);
    }

    const responseData = await response.json();
    console.log('Response:', responseData); // Log the response for inspection
    return responseData;
  } catch (error: any) {
    console.error('Error fetching playlists data:', error.message);
    throw error;
  }
};

export const fetchArtists = async (
  limit: number = 10,
  page: number = 1,
  search: string = ''
) => {
  const apiUrl = 'http://localhost:8000/api'; // You can move this to a global config if needed
  const url = `${apiUrl}/artists/?limit=${limit}&page=${page}&search=${search}`;

  console.log('Fetching Artists:', url);

  try {
    const response = await fetch(url, {
      mode: 'cors', // Add this line
      credentials: 'include',
    });

    if (!response.ok) {
      console.error('Error fetching artists data:', response);
      throw new Error(`Failed to fetch data from ${url}`);
    }

    const responseData = await response.json();
    console.log('Response:', responseData); // Log the response for inspection
    return responseData;
  } catch (error: any) {
    console.error('Error fetching artists data:', error.message);
    throw error;
  }
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