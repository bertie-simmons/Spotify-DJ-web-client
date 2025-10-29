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

// find similar tracks based on audio features
export const findSimilarTracks = async (trackId, tracks) => {
  try {
    // get audio features for the target track
    const targetFeatures = await getAudioFeatures(trackId);
    
    if (!targetFeatures) {
      throw new Error('Could not get audio features for track');
    }

    // get audio features for all comparison tracks
    const trackIds = tracks.map(t => t.id);
    const featuresResponse = await getAudioFeaturesForTracks(trackIds);
    const allFeatures = featuresResponse.audio_features;

    // calculate similarity scores
    const similarTracks = tracks.map((track, index) => {
      const features = allFeatures[index];
      
      if (!features) {
        return { ...track, similarityScore: 0, features: null };
      }

      let score = 0;

      // BPM similarity (0-30 points)
      const bpmDiff = Math.abs(features.tempo - targetFeatures.tempo);
      if (bpmDiff <= 5) score += 30;
      else if (bpmDiff <= 10) score += 20;
      else if (bpmDiff <= 20) score += 10;

      // key compatibility (0-25 points)
      if (areKeysCompatible(features.key, features.mode, targetFeatures.key, targetFeatures.mode)) {
        score += 25;
      }

      // energy similarity (0-15 points)
      const energyDiff = Math.abs(features.energy - targetFeatures.energy);
      score += (1 - energyDiff) * 15;

      // danceability similarity (0-10 points)
      const danceabilityDiff = Math.abs(features.danceability - targetFeatures.danceability);
      score += (1 - danceabilityDiff) * 10;

      // valence (mood) similarity (0-10 points)
      const valenceDiff = Math.abs(features.valence - targetFeatures.valence);
      score += (1 - valenceDiff) * 10;

      // acousticness similarity (0-5 points)
      const acousticnessDiff = Math.abs(features.acousticness - targetFeatures.acousticness);
      score += (1 - acousticnessDiff) * 5;

      // instrumentalness similarity (0-5 points)
      const instrumentalnessDiff = Math.abs(features.instrumentalness - targetFeatures.instrumentalness);
      score += (1 - instrumentalnessDiff) * 5;

      return {
        ...track,
        similarityScore: Math.round(score),
        features: {
          bpm: Math.round(features.tempo),
          key: getKeyName(features.key, features.mode),
          energy: features.energy,
          danceability: features.danceability,
          valence: features.valence,
          acousticness: features.acousticness,
          instrumentalness: features.instrumentalness,
        },
      };
    });

    // sort by similarity score (highest first)
    return similarTracks.sort((a, b) => b.similarityScore - a.similarityScore);
  } catch (error) {
    console.error('Error finding similar tracks:', error);
    throw error;
  }
};

// gets recommendations based on track's audio features
export const getRecommendationsForTrack = async (trackId, limit = 20) => {
  try {
    const features = await getAudioFeatures(trackId);
    
    if (!features) {
      throw new Error('Could not get audio features for track');
    }

    // use audio features as targets for recommendations
    const params = {
      seed_tracks: trackId,
      limit: limit.toString(),
      target_tempo: Math.round(features.tempo).toString(),
      target_energy: features.energy.toFixed(2),
      target_danceability: features.danceability.toFixed(2),
      target_valence: features.valence.toFixed(2),
    };

    // add key if available
    if (features.key !== -1) {
      params.target_key = features.key.toString();
      params.target_mode = features.mode.toString();
    }

    const recommendations = await getRecommendations(params);
    return recommendations.tracks;
  } catch (error) {
    console.error('Error getting recommendations:', error);
    throw error;
  }
};

// get recommendations based on multiple seeds (tracks, artists, genres)
export const getRecommendationsFromSeeds = async ({
  seedTracks = [],
  seedArtists = [],
  seedGenres = [],
  targetFeatures = {},
  limit = 20,
}) => {
  try {
    const params = {
      limit: limit.toString(),
    };

    // add seeds (max 5 total across all types)
    if (seedTracks.length > 0) {
      params.seed_tracks = seedTracks.join(',');
    }
    if (seedArtists.length > 0) {
      params.seed_artists = seedArtists.join(',');
    }
    if (seedGenres.length > 0) {
      params.seed_genres = seedGenres.join(',');
    }

    // add target features if provided
    Object.entries(targetFeatures).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        params[`target_${key}`] = value.toString();
      }
    });

    const recommendations = await getRecommendations(params);
    return recommendations.tracks;
  } catch (error) {
    console.error('Error getting recommendations from seeds:', error);
    throw error;
  }
};

