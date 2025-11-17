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

export const findSimilarTracks = async (spotifyTrackId, limit = 20) => {
  try {
    const similar = await getSimilarTracks(spotifyTrackId, limit);
    
    // get Spotify track data
    const spotifyIds = similar.tracks.map(t => t.spotify_id);
    const spotifyTracks = await getTracks(spotifyIds);
    
    // combine Spotify data with ReccoBeats features
    return spotifyTracks.tracks.map((track, index) => {
      const features = similar.tracks[index];
      return {
        id: track.id,
        name: track.name,
        artist: track.artists.map(a => a.name).join(', '),
        artistId: track.artists[0]?.id,
        album: track.album.name,
        albumArt: track.album.images[0]?.url,
        duration: track.duration_ms,
        uri: track.uri,
        previewUrl: track.preview_url,
        bpm: features.tempo ? Math.round(features.tempo) : null,
        key: getKeyName(features.key, features.mode),
        keyNumber: features.key,
        mode: features.mode,
        energy: features.energy,
        danceability: features.danceability,
        valence: features.valence,
        similarityScore: features.similarity_score || 0,
      };
    });
  } catch (error) {
    console.error('Error finding similar tracks:', error);
    throw error;
  }
};

