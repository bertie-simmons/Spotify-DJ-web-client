const RECCOBEATS_API_BASE = 'https://api.reccobeats.com/v1';

/**
 * Helper function to make requests to reccobeats 
 */
const fetchReccoBeats = async (endpoint, options = {}) => {
  const response = await fetch(`${RECCOBEATS_API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'ReccoBeats API request failed');
  }

  return response.json();
};

/**
 * Get track analysis
 */
export const getTrackAnalysis = async (spotifyTrackId) => {
  return fetchReccoBeats(`/track/${spotifyTrackId}`);
};

/**
 * Get multiple track analysis
 */
export const getMultipleTracksAnalysis = async (spotifyTrackIds) => {
  const ids = spotifyTrackIds.join(',');
  return fetchReccoBeats(`/tracks?ids=${ids}`);
};

/**
 * Get similar tracks based on audio features
 */
export const getSimilarTracks = async (spotifyTrackId, limit = 20) => {
  return fetchReccoBeats(`/track/${spotifyTrackId}/similar?limit=${limit}`);
};

/**
 * Gets recommendations based on seed tracks
 */
export const getRecommendationsBySeeds = async ({ seedTracks = [], limit = 20 }) => {
  const params = new URLSearchParams({
    seed_tracks: seedTracks.join(','),
    limit: limit.toString(),
  });
  
  return fetchReccoBeats(`/recommendations?${params.toString()}`);
};


/**
 * Search for tracks with audio features
 */
export const searchTracksWithFeatures = async (query, limit = 20) => {
  const params = new URLSearchParams({
    q: query,
    limit: limit.toString(),
  });
  
  return fetchReccoBeats(`/search?${params.toString()}`);
};

