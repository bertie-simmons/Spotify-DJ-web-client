import { getAccessToken } from './spotifyAuth';

let player = null;
let deviceId = null;

// initialize Spotify Web Playback SDK
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
