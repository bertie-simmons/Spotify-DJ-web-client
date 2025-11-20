import React, { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import SearchBar from '../components/layout/Searchbar';
import Player from '../components/layout/Player';
import TrackCard from '../components/track/TrackCard';
import TrackList from '../components/track/TrackList';
import SimilarTracks from '../components/track/SimilarTracks';
import { useAuth } from '../context/AuthContext';
import { usePlayback } from '../hooks/usePlayback';
import { usePlayer } from '../context/PlayerContext';
import { 
  getUserPlaylists, 
  getSavedTracks,
  searchTracks,
  getPlaylistTracks,
} from '../services/spotify/spotifyAPI';
import { findSimilarTracks, enrichTracksWithFeatures } from '../services/utils/musicAnalysis';
import { formatTrack } from '../services/utils/formatters';
import { Music } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();
  const { playTrack, playTrackList } = usePlayback();
  const { currentTrack, isPaused } = usePlayer();
  
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [featuredTracks, setFeaturedTracks] = useState([]);
  const [activePlaylist, setActivePlaylist] = useState(null);
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSimilar, setShowSimilar] = useState(false);
  const [selectedTrackForSimilar, setSelectedTrackForSimilar] = useState(null);
  const [similarTracks, setSimilarTracks] = useState([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);

  // Load user playlists and saved tracks on mount
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Load user playlists
      const playlistsData = await getUserPlaylists(50);
      setUserPlaylists(playlistsData.items);

      // Load user's saved tracks
      const savedTracksData = await getSavedTracks(20);
      const tracks = savedTracksData.items
        .filter(item => item.track)
        .map(item => formatTrack(item.track));
      
      // Enrich with audio features from ReccoBeats
      const enrichedTracks = await enrichTracksWithFeatures(tracks);
      setFeaturedTracks(enrichedTracks);
    } catch (error) {
      console.error('Error loading initial data:', error);
      setFeaturedTracks([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    try {
      setIsSearching(true);
      const results = await searchTracks(query, 50);
      const formattedTracks = results.items.map(formatTrack);
      
      // Enrich search results with audio features
      const enrichedTracks = await enrichTracksWithFeatures(formattedTracks);
      setSearchResults(enrichedTracks);
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  // Handle playlist selection
  const handleSelectPlaylist = async (playlistId) => {
    try {
      setActivePlaylist(playlistId);
      setIsSearching(false);
      setShowSimilar(false);
      
      const tracksData = await getPlaylistTracks(playlistId);
      const tracks = tracksData.items
        .filter(item => item.track)
        .map(item => formatTrack(item.track));
      
      // Enrich playlist tracks with audio features
      const enrichedTracks = await enrichTracksWithFeatures(tracks);
      setPlaylistTracks(enrichedTracks);
    } catch (error) {
      console.error('Error loading playlist:', error);
    }
  };

  // Handle create playlist
  const handleCreatePlaylist = async () => {
    console.log('Create playlist - TODO: Add modal');
  };

  // Handle track play
  const handlePlayTrack = async (track) => {
    try {
      await playTrack(track);
    } catch (error) {
      console.error('Error playing track:', error);
    }
  };

  // Handle play from list
  const handlePlayFromList = async (tracks, track) => {
    try {
      const startIndex = tracks.findIndex(t => t.id === track.id);
      await playTrackList(tracks, startIndex);
    } catch (error) {
      console.error('Error playing from list:', error);
    }
  };

  // Handle show similar tracks using ReccoBeats
  const handleShowSimilar = async (track) => {
    try {
      setLoadingSimilar(true);
      setSelectedTrackForSimilar(track);
      setShowSimilar(true);
      
      // Get similar tracks from ReccoBeats
      const similar = await findSimilarTracks(track.id, 20);
      setSimilarTracks(similar);
    } catch (error) {
      console.error('Error finding similar tracks:', error);
      setSimilarTracks([]);
    } finally {
      setLoadingSimilar(false);
    }
  };

  // Determine what to display
  const getDisplayContent = () => {
    if (showSimilar && selectedTrackForSimilar) {
      return (
        <SimilarTracks
          originalTrack={selectedTrackForSimilar}
          similarTracks={similarTracks}
          onPlay={handlePlayTrack}
          onClose={() => setShowSimilar(false)}
        />
      );
    }

    if (isSearching && searchResults.length > 0) {
      return (
        <div>
          <h2 className="text-white text-2xl font-bold mb-4">
            Search Results ({searchResults.length})
          </h2>
          <TrackList
            tracks={searchResults}
            currentTrack={currentTrack}
            isPlaying={!isPaused}
            onPlay={(track) => handlePlayFromList(searchResults, track)}
            onShowSimilar={handleShowSimilar}
          />
        </div>
      );
    }

    if (activePlaylist && playlistTracks.length > 0) {
      const playlist = userPlaylists.find(p => p.id === activePlaylist);
      return (
        <div>
          <h2 className="text-white text-2xl font-bold mb-4">
            {playlist?.name || 'Playlist'}
          </h2>
          <TrackList
            tracks={playlistTracks}
            currentTrack={currentTrack}
            isPlaying={!isPaused}
            onPlay={(track) => handlePlayFromList(playlistTracks, track)}
            onShowSimilar={handleShowSimilar}
          />
        </div>
      );
    }

    return (
      <div>
        <div className="mb-6">
          <h2 className="text-white text-3xl font-bold mb-2">
            Welcome back{user?.displayName ? `, ${user.displayName}` : ''}
          </h2>
          <p className="text-gray-400">Discover music based on BPM, key, and genre</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {featuredTracks.map((track) => (
            <TrackCard
              key={track.id}
              track={track}
              isPlaying={!isPaused}
              isCurrentTrack={currentTrack?.id === track.id}
              onPlay={handlePlayTrack}
            />
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin mb-4 flex justify-center">
            <Music size={48} className="text-spotify-green" />
          </div>
          <p className="text-white">Loading your music...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-neutral-900">
      <div className="flex flex-1 overflow-hidden pt-20">
        <Sidebar 
          playlists={userPlaylists}
          onCreatePlaylist={handleCreatePlaylist}
          onSelectPlaylist={handleSelectPlaylist}
          activePlaylist={activePlaylist}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <SearchBar onSearch={handleSearch} />
          <div className="flex-1 overflow-y-auto bg-gradient-to-b from-neutral-900 to-black p-6">
            {loadingSimilar ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin mb-4 flex justify-center">
                    <Music size={48} className="text-spotify-green" />
                  </div>
                  <p className="text-white">Finding similar tracks...</p>
                </div>
              </div>
            ) : (
              getDisplayContent()
            )}
          </div>
        </div>
      </div>
      
      <Player />
    </div>
  );
};

export default Home;