const RECCOBEATS_API_BASE = 'https://api.reccobeats.com/v1';

const MAX_BATCH_SIZE = 40;
const REQUEST_DELAY_MS = 300;
const MAX_RETRIES = 2;

//==================================== Helpers ===============================================

const sleep = (ms) => new Promise(res => setTimeout(res, ms));

const chunkArray = (arr, size) => {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

const fetchWithRetry = async (url, options, retries = MAX_RETRIES) => {
  try {
    const res = await fetch(url, options);

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || err.message || `ReccoBeats API error: ${res.status}`);
    }

    return res.json();
  } catch (err) {
    if (retries > 0) {
      console.warn(`Retrying ReccoBeats request... (${retries} retries left)`);
      await sleep(500);
      return fetchWithRetry(url, options, retries - 1);
    }
    throw err;
  }
};

//==============================================================================================

/**
 * Get track details from ReccoBeats using Spotify IDs
 * This returns ReccoBeats IDs - needed for audio features
 */
const getTracksBySpotifyIds = async (spotifyIds) => {
  const ids = Array.isArray(spotifyIds) ? spotifyIds.join(',') : spotifyIds;
  return fetchWithRetry(`${RECCOBEATS_API_BASE}/track?ids=${ids}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

/**
 * Get audio features for a single track using ReccoBeats ID
 */
const getAudioFeaturesByReccoId = async (reccobeatsId) => {
  return fetchWithRetry(`${RECCOBEATS_API_BASE}/track/${reccobeatsId}/audio-features`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

//==============================================================================================

/**
 * Gets audio features for multiple tracks via spotify id
 * 
 * Input: array of Spotify track IDs
 * Output: array of tracks with audio features
 */
export const getMultipleTracksAnalysis = async (trackIds) => {
  if (!Array.isArray(trackIds) || trackIds.length === 0) {
    return [];
  }

  const batches = chunkArray(trackIds, MAX_BATCH_SIZE);
  const results = [];

  for (let i = 0; i < batches.length; i++) {
    try {
      const batch = batches[i];

      const trackData = await getTracksBySpotifyIds(batch);

      if (!trackData?.tracks || trackData.tracks.length === 0) {
        console.warn('No tracks found in ReccoBeats for batch:', batch);
        continue;
      }

      // get audio features for each track
      const featuresPromises = trackData.tracks.map(async (track) => {
        try {
          const features = await getAudioFeaturesByReccoId(track.id);
          
          // combine track info with features
          return {
            ...features,
            reccobeats_id: track.id,
            href: track.href,
            spotify_id: track.href?.split('/track/')[1] || null
          };
        } catch (err) {
          console.error(`Failed to get features for track ${track.id}:`, err.message);
          return null;
        }
      });

      const batchResults = await Promise.all(featuresPromises);
      results.push(...batchResults.filter(r => r !== null));

      // rate limiting
      if (i < batches.length - 1) {
        await sleep(REQUEST_DELAY_MS);
      }

    } catch (err) {
      console.error('ReccoBeats batch failed:', err.message);
    }
  }

  return results;
};