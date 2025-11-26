import { getAccessToken } from './spotifyAuth';

let player = null;
let deviceId = null;

/** Initializes Spotify Web Playback SDK */
export const initializePlayer = (accessToken, callbacks = {}) => {
  return new Promise((resolve, reject) => {
    // check if SDK is already loaded
    if (window.Spotify) {
      setupPlayer(accessToken, callbacks, resolve, reject);
      return;
    }

    // load Spotify SDK script
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      setupPlayer(accessToken, callbacks, resolve, reject);
    };
  });
};

const setupPlayer = (accessToken, callbacks, resolve, reject) => {
  player = new window.Spotify.Player({
    name: 'Music Discovery Player',
    getOAuthToken: (cb) => {
      cb(accessToken);
    },
    volume: 0.5,
  });

  // Error handling
  player.addListener('initialization_error', ({ message }) => {
    console.error('Failed to initialize', message);
    if (callbacks.onError) callbacks.onError(message);
    reject(message);
  });

  player.addListener('authentication_error', ({ message }) => {
    console.error('Failed to authenticate', message);
    if (callbacks.onError) callbacks.onError(message);
    reject(message);
  });

  player.addListener('account_error', ({ message }) => {
    console.error('Failed to validate Spotify account', message);
    if (callbacks.onError) callbacks.onError(message);
    reject(message);
  });

  player.addListener('playback_error', ({ message }) => {
    console.error('Failed to perform playback', message);
    if (callbacks.onError) callbacks.onError(message);
  });

  // Ready
  player.addListener('ready', ({ device_id }) => {
    console.log('Ready with Device ID', device_id);
    deviceId = device_id;
    if (callbacks.onReady) callbacks.onReady(device_id);
    resolve(device_id);
  });

  // Not Ready
  player.addListener('not_ready', ({ device_id }) => {
    console.log('Device ID has gone offline', device_id);
    if (callbacks.onNotReady) callbacks.onNotReady(device_id);
  });

  // Player state changes
  player.addListener('player_state_changed', (state) => {
    if (!state) return;
    if (callbacks.onStateChange) callbacks.onStateChange(state);
  });

  // Connect to the player
  player.connect().then((success) => {
    if (success) {
      console.log('The Web Playback SDK successfully connected to Spotify!');
    } else {
      reject('Failed to connect to Spotify');
    }
  });
};

/** Gets current player instance */
export const getPlayer = () => player;

/** Gets current device ID */
export const getDeviceId = () => deviceId;

/** Disconnect and cleanup player */
export const disconnectPlayer = () => {
  if (player) {
    player.disconnect();
    player = null;
    deviceId = null;
  }
};

/** Plays a track given its uri */
export const playTrack = async (spotifyUri, position = 0) => {
  if (!deviceId){
    throw new Error('No device ID available. Initialize the player first.');
  }

  const token = await getAccessToken();

  const body = {
    device_id: deviceId,
  };

  // check if its a single track or a context - album/playlist
  if (spotifyUri.includes('track')) {
    body.uris = [spotifyUri];
  } else {
    body.context_uri = spotifyUri;
  }

  if (position > 0) {
    body.position_ms = position;
  }

  const response = await fetch('https://api.spotify.com/v1/me/player/play', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error('Failed to start playback');
  }
};

/** Plays multiple tracks by playing the inital track and setting the rest in a queue */
export const playTracks = async (trackUris, position = 0) => {
  if (!deviceId) {
    throw new Error('No device ID available');
  }

  const token = await getAccessToken();
  
  const body = {
    uris: trackUris,
    position_ms: position,
  };

  const response = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error('Failed to play tracks');
  }
};

/** Toggle play and pause */
export const togglePlay = async () => {
  if (!player) return;
  return player.togglePlay();
};

/** Toggle resume */
export const resume = async () => {
  if (!player) return;
  return player.resume();
};

/** Toggle pause */
export const pause = async () => {
  if (!player) return;
  return player.pause();
};

/** Skip to next track */
export const nextTrack = async () => {
  if (!player) return;
  return player.nextTrack();
};

/** Skip to previous track */
export const previousTrack = async () => {
  if (!player) return;
  return player.previousTrack();
};

/** Seek to position (ms) */
export const seek = async (positionMs) => {
  if (!player) return;
  return player.seek(positionMs);
};

/** Set volume (0-1) */
export const setVolume = async (volume) => {
  if (!player) return;
  return player.setVolume(volume);
};

/** Get current playback state */
export const getCurrentState = async () => {
  if (!player) return null;
  return player.getCurrentState();
};

/** Transfer playback to this device */
export const transferPlayback = async () => {
  if (!deviceId) {
    throw new Error('No device ID available');
  }

  const token = await getAccessToken();

  const response = await fetch('https://api.spotify.com/v1/me/player', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      device_ids: [deviceId],
      play: false,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to transfer playback');
  }
};