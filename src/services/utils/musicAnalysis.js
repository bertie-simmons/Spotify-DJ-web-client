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

/**
 * calculates similarity scores between 2 tracks which is used to find reccomendations
 */
export const calculateSimilarity = (track1Features, track2Features) => {
  let score = 0;

  // BPM similarity (0-30 points)
  if (track1Features.bpm && track2Features.bpm) {
    const bpmDiff = Math.abs(track1Features.bpm - track2Features.bpm);
    if (bpmDiff <= 5) score += 30;
    else if (bpmDiff <= 10) score += 20;
    else if (bpmDiff <= 20) score += 10;
  }

  // Key compatibility (0-25 points)
  if (track1Features.keyNumber !== null && track2Features.keyNumber !== null) {
    if (areKeysCompatible(
      track1Features.keyNumber, 
      track1Features.mode, 
      track2Features.keyNumber, 
      track2Features.mode
    )) {
      score += 25;
    }
  }

  // Energy similarity (0-15 points)
  if (track1Features.energy !== null && track2Features.energy !== null) {
    const energyDiff = Math.abs(track1Features.energy - track2Features.energy);
    score += (1 - energyDiff) * 15;
  }

  // Danceability similarity (0-10 points)
  if (track1Features.danceability !== null && track2Features.danceability !== null) {
    const danceabilityDiff = Math.abs(track1Features.danceability - track2Features.danceability);
    score += (1 - danceabilityDiff) * 10;
  }

  // Valence similarity (0-10 points)
  if (track1Features.valence !== null && track2Features.valence !== null) {
    const valenceDiff = Math.abs(track1Features.valence - track2Features.valence);
    score += (1 - valenceDiff) * 10;
  }

  return Math.round(score);
};

export const formatTrackWithFeatures = async (spotifyTrack) => {
  try {
    const features = await getTrackWithFeatures(spotifyTrack.id);
    
    return {
      id: spotifyTrack.id,
      name: spotifyTrack.name,
      artist: spotifyTrack.artists.map(a => a.name).join(', '),
      artistId: spotifyTrack.artists[0]?.id,
      album: spotifyTrack.album.name,
      albumArt: spotifyTrack.album.images[0]?.url,
      duration: spotifyTrack.duration_ms,
      uri: spotifyTrack.uri,
      previewUrl: spotifyTrack.preview_url,
      ...features,
    };
  } catch (error) {
    console.error('Error formatting track with features:', error);
    return {
      id: spotifyTrack.id,
      name: spotifyTrack.name,
      artist: spotifyTrack.artists.map(a => a.name).join(', '),
      artistId: spotifyTrack.artists[0]?.id,
      album: spotifyTrack.album.name,
      albumArt: spotifyTrack.album.images[0]?.url,
      duration: spotifyTrack.duration_ms,
      uri: spotifyTrack.uri,
      previewUrl: spotifyTrack.preview_url,
    };
  }
};

/**
 * enriches track with features
 */
export const enrichTracksWithFeatures = async (tracks) => {
  try {
    const trackIds = tracks.map(t => t.id);
    const analysisData = await getMultipleTracksAnalysis(trackIds);
    
    return tracks.map((track, index) => {
      const features = analysisData.tracks[index];
      if (!features) return track;
      
      return {
        ...track,
        bpm: features.tempo ? Math.round(features.tempo) : null,
        key: getKeyName(features.key, features.mode),
        keyNumber: features.key,
        mode: features.mode,
        energy: features.energy,
        danceability: features.danceability,
        valence: features.valence,
      };
    });
  } catch (error) {
    console.error('Error enriching tracks with features:', error);
    return tracks;
  }
};