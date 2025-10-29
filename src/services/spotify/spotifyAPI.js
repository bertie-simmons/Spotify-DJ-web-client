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

// ==============================  PLAYLISTS  ====================================

export const getUserPlaylists = async (limit = 100) => {
  return fetchWithAuth(`/me/playlists?limit=${limit}`);
};

export const getPlaylist = async (playlistId) => {
  return fetchWithAuth(`/playlists/${playlistId}`);
};

export const getPlaylistTracks = async (playlistId, limit = 100) => {
  return fetchWithAuth(`/playlists/${playlistId}/tracks?limit=${limit}`);
};

export const createPlaylist = async (userId, name, description = '', isPublic = true) => {
  return fetchWithAuth(`/users/${userId}/playlists`, {
    method: 'POST',
    body: JSON.stringify({
      name,
      description,
      public: isPublic,
    }),
  });
};

export const addTracksToPlaylist = async (playlistId, trackUris) => {
  return fetchWithAuth(`/playlists/${playlistId}/tracks`, {
    method: 'POST',
    body: JSON.stringify({
      uris: trackUris,
    }),
  });
};

export const removeTracksFromPlaylist = async (playlistId, trackUris) => {
  return fetchWithAuth(`/playlists/${playlistId}/tracks`, {
    method: 'DELETE',
    body: JSON.stringify({
      tracks: trackUris.map(uri => ({ uri })),
    }),
  });
};

// ==============================  TRACKS  ====================================

export const getTrack = async (trackId) => {
  return fetchWithAuth(`/tracks/${trackId}`);
};

export const getTracks = async (trackIds) => {
  const ids = trackIds.join(',');
  return fetchWithAuth(`/tracks?ids=${ids}`);
};

export const getSavedTracks = async (limit = 50, offset = 0) => {
  return fetchWithAuth(`/me/tracks?limit=${limit}&offset=${offset}`);
};

export const saveTrack = async (trackId) => {
  return fetchWithAuth(`/me/tracks?ids=${trackId}`, {
    method: 'PUT',
  });
};

export const removeSavedTrack = async (trackId) => {
  return fetchWithAuth(`/me/tracks?ids=${trackId}`, {
    method: 'DELETE',
  });
};

export const checkSavedTracks = async (trackIds) => {
  const ids = trackIds.join(',');
  return fetchWithAuth(`/me/tracks/contains?ids=${ids}`);
};

// ==============================  ALBUMS  ====================================

export const getAlbum = async (albumId) => {
  return fetchWithAuth(`/albums/${albumId}`);
};

export const getAlbumTracks = async (albumId, limit = 50) => {
  return fetchWithAuth(`/albums/${albumId}/tracks?limit=${limit}`);
};

// ==============================  ARTISTS  ====================================

export const getArtist = async (artistId) => {
  return fetchWithAuth(`/artists/${artistId}`);
};

export const getArtistTopTracks = async (artistId, market = 'US') => {
  return fetchWithAuth(`/artists/${artistId}/top-tracks?market=${market}`);
};

export const getArtistAlbums = async (artistId, limit = 20) => {
  return fetchWithAuth(`/artists/${artistId}/albums?limit=${limit}`);
};

export const getRelatedArtists = async (artistId) => {
  return fetchWithAuth(`/artists/${artistId}/related-artists`);
};

// ======================== BROWSE =================================

export const getFeaturedPlaylists = async (limit = 20) => {
  return fetchWithAuth(`/browse/featured-playlists?limit=${limit}`);
};

export const getNewReleases = async (limit = 20) => {
  return fetchWithAuth(`/browse/new-releases?limit=${limit}`);
};

export const getCategories = async (limit = 50) => {
  return fetchWithAuth(`/browse/categories?limit=${limit}`);
};

export const getCategoryPlaylists = async (categoryId, limit = 20) => {
  return fetchWithAuth(`/browse/categories/${categoryId}/playlists?limit=${limit}`);
};

export const getRecommendations = async (params) => {
  // params can include seed_artists, seed_tracks, seed_genres, target_*, min_*, max_*
  const queryParams = new URLSearchParams(params);
  return fetchWithAuth(`/recommendations?${queryParams.toString()}`);
};

// ======================= PLAYBACK ========================================

export const getPlaybackState = async () => {
  return fetchWithAuth('/me/player');
};

export const transferPlayback = async (deviceId, play = true) => {
  return fetchWithAuth('/me/player', {
    method: 'PUT',
    body: JSON.stringify({
      device_ids: [deviceId],
      play,
    }),
  });
};

export const play = async (deviceId, contextUri = null, uris = null, offset = null) => {
  const body = {};
  if (contextUri) body.context_uri = contextUri;
  if (uris) body.uris = uris;
  if (offset) body.offset = offset;

  const endpoint = deviceId ? `/me/player/play?device_id=${deviceId}` : '/me/player/play';
  
  return fetchWithAuth(endpoint, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
};

export const pause = async (deviceId = null) => {
  const endpoint = deviceId ? `/me/player/pause?device_id=${deviceId}` : '/me/player/pause';
  return fetchWithAuth(endpoint, {
    method: 'PUT',
  });
};

export const skipToNext = async (deviceId = null) => {
  const endpoint = deviceId ? `/me/player/next?device_id=${deviceId}` : '/me/player/next';
  return fetchWithAuth(endpoint, {
    method: 'POST',
  });
};

export const skipToPrevious = async (deviceId = null) => {
  const endpoint = deviceId ? `/me/player/previous?device_id=${deviceId}` : '/me/player/previous';
  return fetchWithAuth(endpoint, {
    method: 'POST',
  });
};

export const seek = async (positionMs, deviceId = null) => {
  const endpoint = deviceId 
    ? `/me/player/seek?position_ms=${positionMs}&device_id=${deviceId}` 
    : `/me/player/seek?position_ms=${positionMs}`;
  
  return fetchWithAuth(endpoint, {
    method: 'PUT',
  });
};

export const setVolume = async (volumePercent, deviceId = null) => {
  const endpoint = deviceId 
    ? `/me/player/volume?volume_percent=${volumePercent}&device_id=${deviceId}` 
    : `/me/player/volume?volume_percent=${volumePercent}`;
  
  return fetchWithAuth(endpoint, {
    method: 'PUT',
  });
};

export const setRepeat = async (state, deviceId = null) => {
  // state: 'track', 'context', 'off'
  const endpoint = deviceId 
    ? `/me/player/repeat?state=${state}&device_id=${deviceId}` 
    : `/me/player/repeat?state=${state}`;
  
  return fetchWithAuth(endpoint, {
    method: 'PUT',
  });
};

export const setShuffle = async (state, deviceId = null) => {
  // state: true or false
  const endpoint = deviceId 
    ? `/me/player/shuffle?state=${state}&device_id=${deviceId}` 
    : `/me/player/shuffle?state=${state}`;
  
  return fetchWithAuth(endpoint, {
    method: 'PUT',
  });
};

export const getAvailableDevices = async () => {
  return fetchWithAuth('/me/player/devices');
};

export const getRecentlyPlayed = async (limit = 50) => {
  return fetchWithAuth(`/me/player/recently-played?limit=${limit}`);
};

export const getQueue = async () => {
  return fetchWithAuth('/me/player/queue');
};

export const addToQueue = async (uri, deviceId = null) => {
  const endpoint = deviceId 
    ? `/me/player/queue?uri=${uri}&device_id=${deviceId}` 
    : `/me/player/queue?uri=${uri}`;
  
  return fetchWithAuth(endpoint, {
    method: 'POST',
  });
};