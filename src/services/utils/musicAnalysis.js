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

