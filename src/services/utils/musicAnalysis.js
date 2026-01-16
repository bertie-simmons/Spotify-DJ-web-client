import { getMultipleTracksAnalysis } from '../reccobeats/reccobeatsAPI';
import { CAMELOT_WHEEL } from '../../lib/constants';

/**
 * Convert to Camelot 
 */
export const getCamelotKey = (key, mode) => {
  if (key === null || key === undefined || mode === null || mode === undefined) {
    return null;
  }
  
  const modeType = mode === 1 ? 'major' : 'minor';
  return CAMELOT_WHEEL[modeType][key] || null;
};

/**
 * Extract Spotify track IDs from track objects
 */
const extractSpotifyIds = (tracks) => {
  return tracks
    .map(track => track?.id || track?.track?.id)
    .filter(id => id);
};

/**
 * Enrich tracks with audio analysis data from reccobeats
 */
export const enrichTracksWithFeatures = async (tracks) => {
  if (!Array.isArray(tracks) || tracks.length === 0) {
    return tracks;
  }

  try {
    // extract Spotify IDs
    const spotifyIds = extractSpotifyIds(tracks);
    
    if (spotifyIds.length === 0) {
      console.warn('No valid Spotify IDs found in tracks');
      return tracks;
    }

    // get audio features from Reccobeats
    const audioFeatures = await getMultipleTracksAnalysis(spotifyIds);
    
    if (!audioFeatures || audioFeatures.length === 0) {
      console.warn('No audio features returned from ReccoBeats');
      return tracks;
    }

    // create a map of spotify_id -> features 
    const featuresMap = new Map(
      audioFeatures.map(f => [f.spotify_id, f])
    );

    // enrich each track with its audio features
    return tracks.map(track => {
      const trackId = track?.id || track?.track?.id;
      const features = featuresMap.get(trackId);
      
      if (!features) {
        return track;
      }

      return {
        ...track,
        bpm: features.tempo ? Math.round(features.tempo) : null,
        key: getCamelotKey(features.key, features.mode),
        energy: features.energy,
        danceability: features.danceability,
        valence: features.valence,
        acousticness: features.acousticness,
        instrumentalness: features.instrumentalness,
        speechiness: features.speechiness,
        liveness: features.liveness,
        loudness: features.loudness,
        timeSignature: features.time_signature,
        audioFeatures: features // for reference
      };
    });
  } catch (error) {
    console.error('Error enriching tracks with analysis:', error);
    return tracks; // return original tracks on error
  }
};

// TODO - to see if two tracks are in key 
// 1 up and down or A or B
export const areKeysCompatible = (key1, key2) => {
  return false;
};

export default {
  enrichTracksWithFeatures,
  getCamelotKey,
  areKeysCompatible
};