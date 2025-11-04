import { usePlayer } from '../context/PlayerContext';

// Re-export for convenience
export const useSpotifyPlayer = () => {
  return usePlayer();
};

export default useSpotifyPlayer;