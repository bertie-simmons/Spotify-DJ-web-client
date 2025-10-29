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


// checks if 2 tracks similar by key
export const areKeysCompatible = (key1, mode1, key2, mode2) => {
    // same key and mode
    if (key1 === key2 && mode1 === mode2) return true;

    // relative keys - maj or min - 3 semitones apart
    if (mode1 !== mode2) {
        const diff = Math.abs(key1 - key2);
    if (diff === 3 || diff === 9) return true; // 3 semitones up or down
  }
  
  // Parallel keys (same root, different mode)
  if (key1 === key2 && mode1 !== mode2) return true;
  
  return false;
};

// checks if bpm are similar
export const areBPMsSimilar = (bpm1, bpm2, tolerance = BPM_TOLERANCE) => {
    return Math.abs(bpm1 - bpm2) <= tolerance;
};
