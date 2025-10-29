import { getAudioFeatures, getAudioFeaturesForTracks } from '../spotify/audioFeatures';
import { getRecommendations } from '../spotify/spotifyAPI';
import { MUSICAL_KEYS, MODES, BPM_TOLERANCE, KEY_TOLERANCE } from '../../lib/constants';

// convert Spotify key number to musical key name
export const getKeyName = (key, mode) => {
  if (key === -1) return 'Unknown';
  const keyName = MUSICAL_KEYS[key] || 'Unknown';
  const modeName = MODES[mode] || '';
  return `${keyName} ${modeName}`;
};
