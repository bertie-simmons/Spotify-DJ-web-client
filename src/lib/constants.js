export const SPOTIFY_AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
export const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';

// Camelot Wheel mapping
export const CAMELOT_WHEEL = {
  // Major keys (mode = 1)
  major: {
    0: '8B', 
    1: '3B',  
    2: '10B', 
    3: '5B',  
    4: '12B', 
    5: '7B',  
    6: '2B',  
    7: '9B',  
    8: '4B',  
    9: '11B', 
    10: '6B', 
    11: '1B'  
  },
  
  minor: {
    0: '5A',  
    1: '12A', 
    2: '7A',  
    3: '2A',  
    4: '9A',  
    5: '4A',  
    6: '11A', 
    7: '6A',  
    8: '1A',  
    9: '8A',  
    10: '3A', 
    11: '10A' 
  }
};


// BPM tolerance for similar tracks
export const BPM_TOLERANCE = 5;

// Key tolerance (semitones)
export const KEY_TOLERANCE = 2;