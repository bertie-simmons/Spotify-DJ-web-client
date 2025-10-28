import { useAuth } from '../context/AuthContext';

// Re-export for convenience
export const useSpotifyAuth = () => {
  return useAuth();
};

export default useSpotifyAuth;