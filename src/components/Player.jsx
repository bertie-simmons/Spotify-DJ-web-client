import { useEffect, useState } from 'react';

export default function Player({ token }) {
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    if (!token) return;

    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const playerInstance = new window.Spotify.Player({
        name: 'My Spotify Player',
        getOAuthToken: cb => cb(token),
      });

      playerInstance.connect();
      setPlayer(playerInstance);
    };
  }, [token]);

  return <div>{player ? 'Player Ready' : 'Loading Player...'}</div>;
}