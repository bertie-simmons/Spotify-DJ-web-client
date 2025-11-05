import { useState, useCallback } from 'react';
import { 
  getUserPlaylists, 
  createPlaylist,
  addTracksToPlaylist,
  removeTracksFromPlaylist,
  getPlaylistTracks,
} from '../services/spotify/spotifyAPI';

export const usePlaylists = (userId) => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load all user playlists
  const loadPlaylists = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUserPlaylists(50);
      setPlaylists(data.items);
      return data.items;
    } catch (err) {
      setError(err.message);
      console.error('Error loading playlists:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  
};

export default usePlaylists;