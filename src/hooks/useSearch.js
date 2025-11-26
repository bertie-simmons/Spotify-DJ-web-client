import { useState, useCallback } from 'react';
import { search, searchTracks, searchArtists, searchPlaylists } from '../services/spotify/spotifyAPI';

export const useSearch = () => {
  const [results, setResults] = useState({
    tracks: [],
    artists: [],
    playlists: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /** Search all types - tracks, artists, playlists */
  const searchAll = useCallback(async (query, limit = 20) => {
    if (!query.trim()) {
      setResults({ tracks: [], artists: [], playlists: [] });
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await search(query, ['track', 'artist', 'playlist'], limit);
      
      setResults({
        tracks: data.tracks?.items || [],
        artists: data.artists?.items || [],
        playlists: data.playlists?.items || [],
      });
      
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error searching:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /** Search tracks only */
  const searchTracksOnly = useCallback(async (query, limit = 20) => {
    if (!query.trim()) {
      setResults(prev => ({ ...prev, tracks: [] }));
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await searchTracks(query, limit);
      setResults(prev => ({ ...prev, tracks: data.items }));
      return data.items;
    } catch (err) {
      setError(err.message);
      console.error('Error searching tracks:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /** Search for artists only */
  const searchArtistsOnly = useCallback(async (query, limit = 20) => {
    if (!query.trim()) {
      setResults(prev => ({ ...prev, artists: [] }));
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await searchArtists(query, limit);
      setResults(prev => ({ ...prev, artists: data.items }));
      return data.items;
    } catch (err) {
      setError(err.message);
      console.error('Error searching artists:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /** Search for playlists only */
  const searchPlaylistsOnly = useCallback(async (query, limit = 20) => {
    if (!query.trim()) {
      setResults(prev => ({ ...prev, playlists: [] }));
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await searchPlaylists(query, limit);
      setResults(prev => ({ ...prev, playlists: data.items }));
      return data.items;
    } catch (err) {
      setError(err.message);
      console.error('Error searching playlists:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /** Clear search results */
  const clearResults = useCallback(() => {
    setResults({ tracks: [], artists: [], playlists: [] });
    setError(null);
  }, []);

  return {
    results,
    loading,
    error,
    searchAll,
    searchTracks: searchTracksOnly,
    searchArtists: searchArtistsOnly,
    searchPlaylists: searchPlaylistsOnly,
    clearResults,
  };
};

export default useSearch;