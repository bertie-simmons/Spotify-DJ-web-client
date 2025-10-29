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

