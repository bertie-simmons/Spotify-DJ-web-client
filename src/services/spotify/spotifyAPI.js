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