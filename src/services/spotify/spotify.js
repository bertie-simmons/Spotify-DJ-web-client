import { getAccessToken } from './spotifyAuth';

const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';

const fetchWithAuth = async (endpoint, options = {}) => {
  const token = await getAccessToken();
  
  if (!token) {
    throw new Error('No access token available');
  }

  const response = await fetch(`${SPOTIFY_API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || 'API request failed');
  }

  return response.json();
};

export const getUserProfile = async (token) => {
  return fetchWithAuth('/me');
};

export const search = async (query, types = ['track', 'artist', 'album', 'playlist'], limit = 20) => {
  const typeString = types.join(',');
  const params = new URLSearchParams({
    q: query,
    type: typeString,
    limit: limit.toString(),
  });

  return fetchWithAuth(`/search?${params.toString()}`);
};

export const searchTracks = async (query, limit = 20) => {
  const result = await search(query, ['track'], limit);
  return result.tracks;
};

export const searchArtists = async (query, limit = 20) => {
  const result = await search(query, ['artist'], limit);
  return result.artists;
};

export const searchPlaylists = async (query, limit = 20) => {
  const result = await search(query, ['playlist'], limit);
  return result.playlists;
};


export const getPlaylists = async (token) => {
  const res = await fetch('https://api.spotify.com/v1/me/playlists', {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  return data.items || [];
};

// bpm, key, energy, danceability, valence
export const getAudioFeatures = async (token, trackId) => {
  const res = await fetch(`https://api.spotify.com/v1/audio-features/${trackId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

export const getRecommendations = async (token, seedTrackId, filters = {}) => {
  let url = `https://api.spotify.com/v1/recommendations?seed_tracks=${seedTrackId}&limit=20`;
  if (filters.key) url += `&target_key=${filters.key}`;
  if (filters.bpm) url += `&target_tempo=${filters.bpm}`;
  if (filters.energy) url += `&target_energy=${filters.energy}`;
  if (filters.danceability) url += `&target_danceability=${filters.danceability}`;
  if (filters.valence) url += `&target_valence=${filters.valence}`;

  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  const data = await res.json();
  return data.tracks;
};

export const playTrack = async (token, deviceId, uri) => {
  await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ uris: [uri] }),
  });
};


export const addToPlaylist = async (token, playlistId, uri) => {
  await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ uris: [uri] }),
  });
};