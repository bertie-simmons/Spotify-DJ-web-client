
// This is depreciated now :(

// import { getAccessToken } from './spotifyAuth';

// const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';

// // helper function to make authenticated requests
// const fetchWithAuth = async (endpoint, options = {}) => {
//     const token = await getAccessToken(); 

//     if (!token) {
//         throw new Error('No access token available');
//     }

//     const response = await fetch(`${SPOTIFY_API_BASE}${endpoint}`, {
//         ...options,
//         headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json',
//             ...options.headers,
//         },
//     });

//     if (!response.ok) {
//         const error = await response.json().catch(() => ({}));
//         throw new Error(error.error?.message || 'API request failed');
//     }

//     return response.json();
// };


// // for single track
// export const getAudioFeatures = async (trackId) => {
//     return fetchWithAuth(`/audio-features/${trackId}`);
// };

// // for multiple tracks
// export const getAudioFeaturesForTracks = async (trackIds) => {
//     const idsParam = trackIds.join(',');
//     return fetchWithAuth(`/audio-features?ids=${idsParam}`);
// };

// export const getAudioAnalysis = async (trackId) => {
//     return fetchWithAuth(`/audio-analysis/${trackId}`);
// };

// export const getAvailableGenreSeeds = async () => {
//     return fetchWithAuth('/recommendations/available-genre-seeds');
// };