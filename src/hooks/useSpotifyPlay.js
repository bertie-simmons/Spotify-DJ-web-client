import { useEffect, useState } from "react";

export default function useSpotifyPlayer(token) {
  const [player, setPlayer] = useState(null);
  const [deviceId, setDeviceId] = useState("");
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!token) return;

    // load spotify sdk
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    // initialize spotify player
    window.onSpotifyWebPlaybackSDKReady = () => {
      const spotifyPlayer = new window.Spotify.Player({
        name: "Spotify Music Finder",
        getOAuthToken: (cb) => cb(token),
        volume: 0.5,
      });

    // event listeners
      spotifyPlayer.addListener("ready", ({ device_id }) => setDeviceId(device_id));
      spotifyPlayer.addListener("player_state_changed", (state) => {
        if (state) {
          setCurrentTrack(state.track_window.current_track);
          setIsPlaying(!state.paused);
        }
      });

    // connect to spotify
      spotifyPlayer.connect();
      setPlayer(spotifyPlayer);
    };
  }, [token]);

  return { player, deviceId, currentTrack, isPlaying };
}