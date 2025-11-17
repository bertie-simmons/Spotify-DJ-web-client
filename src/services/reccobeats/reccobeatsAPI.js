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
