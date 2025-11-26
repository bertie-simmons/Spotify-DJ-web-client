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

  /** Load all user playlists */
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

  /** Create playlist */
  const create = useCallback(async (name, description = '', isPublic = true) => {
    if (!userId) {
      throw new Error('User ID is required to create a playlist');
    }

    try {
      setLoading(true);
      setError(null);
      const newPlaylist = await createPlaylist(userId, name, description, isPublic);
      setPlaylists(prev => [newPlaylist, ...prev]);
      return newPlaylist;
    } catch (err) {
      setError(err.message);
      console.error('Error creating playlist:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  /** Add tracks to a playlist */
  const addTracks = useCallback(async (playlistId, trackUris) => {
    try {
      setLoading(true);
      setError(null);
      await addTracksToPlaylist(playlistId, trackUris);
      return true;
    } catch (err) {
      setError(err.message);
      console.error('Error adding tracks to playlist:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  /** Remove tracks from a playlist */
  const removeTracks = useCallback(async (playlistId, trackUris) => {
    try {
      setLoading(true);
      setError(null);
      await removeTracksFromPlaylist(playlistId, trackUris);
      return true;
    } catch (err) {
      setError(err.message);
      console.error('Error removing tracks from playlist:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  /** Get tracks from a playlist */
  const getTracks = useCallback(async (playlistId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPlaylistTracks(playlistId);
      return data.items;
    } catch (err) {
      setError(err.message);
      console.error('Error loading playlist tracks:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    playlists,
    loading,
    error,
    loadPlaylists,
    create,
    addTracks,
    removeTracks,
    getTracks,
  };
};

export default usePlaylists;