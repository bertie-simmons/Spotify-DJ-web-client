import { getTrackAnalysis, getSimilarTracks, getMultipleTracksAnalysis } from '../reccobeats/reccobeatsAPI';
import { getTracks } from '../spotify/spotifyAPI';
import { MUSICAL_KEYS, MODES, BPM_TOLERANCE } from '../../lib/constants';

/**
 * convert ReccoBeats key number to musical key name
 */
export const getKeyName = (key, mode) => {
  if (key === -1 || key === null) return 'Unknown';
  const keyName = MUSICAL_KEYS[key] || 'Unknown';
  const modeName = mode === 1 ? 'Major' : mode === 0 ? 'Minor' : '';
  return `${keyName} ${modeName}`;
};

/**
 * checks if keys are compatible between 2 tracks
 */
export const areKeysCompatible = (key1, mode1, key2, mode2) => {
  if (key1 === key2 && mode1 === mode2) return true;
  
  if (mode1 !== mode2) {
    const diff = Math.abs(key1 - key2);
    if (diff === 3 || diff === 9) return true;
  }
  
  if (key1 === key2 && mode1 !== mode2) return true;
  
  return false;
};

/** checks if 2 bpms are similar */
export const areBPMsSimilar = (bpm1, bpm2, tolerance = BPM_TOLERANCE) => {
  return Math.abs(bpm1 - bpm2) <= tolerance;
};

export const getTrackWithFeatures = async (spotifyTrackId) => {
  try {
    const analysis = await getTrackAnalysis(spotifyTrackId);
    return {
      id: spotifyTrackId,
      bpm: analysis.tempo ? Math.round(analysis.tempo) : null,
      key: getKeyName(analysis.key, analysis.mode),
      keyNumber: analysis.key,
      mode: analysis.mode,
      energy: analysis.energy,
      danceability: analysis.danceability,
      valence: analysis.valence,
      acousticness: analysis.acousticness,
      instrumentalness: analysis.instrumentalness,
      loudness: analysis.loudness,
      speechiness: analysis.speechiness,
    };
  } catch (error) {
    console.error('Error getting track features:', error);
    return null;
  }
};

