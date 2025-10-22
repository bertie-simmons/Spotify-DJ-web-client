import axios from 'axios';

const BASE_URL = 'https://api.spotify.com/v1';

export const spotifyApi = (token) =>
  axios.create({
    baseURL: BASE_URL,
    headers: { Authorization: `Bearer ${token}` },
  });

// Example search by audio features (key, bpm)
export const searchTracksByFeatures = async (token, features) => {
  const { key, bpm } = features;
  const response = await spotifyApi(token).get(`/recommendations`, {
    params: { seed_genres: 'pop', target_key: key, target_tempo: bpm },
  });
  return response.data.tracks;
};