// import { refreshToken, getRefreshToken } from './auth';
// import { SubmissionData, Ballot } from '../types'
// import { Playlist } from '../types';

// const apiUrl = process.env.API_BASE_URL

// const baseFetch = async (url: string, options?: RequestInit) => {
//   const response = await fetch(`${apiUrl}${url}`, {
//     mode: 'cors',
//     ...options,
//   });

//   if (!response.ok) {
//     console.log(response);
//     throw new Error(`Failed to fetch data from ${url}`);
//   }

//   return response.json();
// };

// const fetchProtectedData = async (url: string, options?: RequestInit) => {
//   try {
//     const response = await baseFetch(url, options);

//     if (!response.ok && response.status === 401) {
//       const refreshTokenValue = getRefreshToken();
//       if (refreshTokenValue) {
//         const refreshTokenResponse = await refreshToken(refreshTokenValue);
//         const newAccessToken = refreshTokenResponse.access_token;
//         const newOptions = {
//           ...options,
//           headers: {
//             ...options?.headers,
//             Authorization: `Bearer ${newAccessToken}`,
//           },
//         };
//         return await baseFetch(url, newOptions);
//       } else {
//         throw new Error('Refresh token not available');
//       }
//     }

//     return response;
//   } catch (error: any) {
//     console.error('Error fetching protected data:', error.message);
//     throw error;
//   }
// };


// export const registerRequest = async (
//   username: string,
//   password1: string,
//   password2: string,
//   email: string
// ) => {
//   const data = { username, password1, password2, email };
//   return await baseFetch('/register/', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(data),
//   });
// };

// export const forgotPasswordRequest = async (username: string) => {
//   // Implement your forgot password request logic
// };

// export const fetchPlaylist = async (playlistId: number) => {
//   return await baseFetch(`/playlists/${playlistId}`);
// };

// export const fetchPlaylists = async (
//   limit: number = 10,
//   page: number = 1,
//   search: string = ''
// ) => {
//   const url = `/playlists/?limit=${limit}&page=${page}&search=${search}`;
//   return await baseFetch(url);
// };

// export const fetchArtist = async (artistId: number) => {
//   return await baseFetch(`/artists/${artistId}`);
// };

// export const fetchArtistByName = async (artistName: string) => {
//   const url = `/artists?name=${encodeURIComponent(artistName)}`;
//   return await baseFetch(url);
// };

// export const fetchArtists = async (
//   limit: number = 10,
//   page: number = 1,
//   search: string = ''
// ) => {
//   const url = `/artists/?limit=${limit}&page=${page}&search=${search}`;
//   return await baseFetch(url);
// };

// export const fetchSubmission = async () => {
//   return await fetchProtectedData('/submission');
// };

// export const submitOrUpdateSubmission = async (data: SubmissionData) => {
//   return await fetchProtectedData('/songs/', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(data),
//   });
// };

// export const fetchChallengeData = async () => {
//   return await baseFetch('/challenge');
// };

// export const fetchContestData = async (): Promise<Playlist | null> => {
//   try {
//     const response = await baseFetch('/contest/'); // Update with your endpoint
//     return response as Playlist;
//   } catch (error: any) {
//     console.error('Error fetching contest data:', error.message);
//     throw error;
//   }
// };

// export const submitVoteAndReview = async (data: Ballot) => {
//   return await fetchProtectedData('/vote/', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(data),
//   });
// };

// Since this file is currently just comments, we need to make it a module
export {}; // This makes the file a TypeScript module