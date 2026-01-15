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
import { useNavigation } from '../context/NavigationContext';
import { useSearch } from '../hooks/useSearch';
import { usePlaylists } from '../hooks/usePlaylists';
import { getSavedTracks } from '../services/spotify/spotifyAPI';
import { findSimilarTracks, enrichTracksWithFeatures } from '../services/utils/musicAnalysis';
import { formatTrack } from '../services/utils/formatters';
import { Music } from 'lucide-react';
import logo from '../assets/Spotify_Primary_Logo_RGB_Green.png';

const Home = () => {
  const { user } = useAuth();
  const { playTrack, playTrackList } = usePlayback();
  const { currentTrack, isPaused } = usePlayer();
  const { currentView, navigate } = useNavigation();
  
  const { results: searchResults, loading: searchLoading, searchTracks, clearResults } = useSearch();
  const { 
    playlists: userPlaylists, 
    loading: playlistsLoading, 
    loadPlaylists, 
    getTracks: getPlaylistTracksHook 
  } = usePlaylists(user?.id);
  
  const [featuredTracks, setFeaturedTracks] = useState([]);
  const [activePlaylist, setActivePlaylist] = useState(null);
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSimilar, setShowSimilar] = useState(false);
  const [selectedTrackForSimilar, setSelectedTrackForSimilar] = useState(null);
  const [similarTracks, setSimilarTracks] = useState([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);

  // load user playlists and saved tracks on mount
  useEffect(() => {
    loadInitialData();
  }, []);

  // navigation
  useEffect(() => {
    if (!currentView) return;

    switch (currentView.type) {
      case 'home':
        setIsSearching(false);
        setShowSimilar(false);
        setActivePlaylist(null);
        clearResults();
        break;
      
      case 'playlist':
        handleSelectPlaylist(currentView.playlistId, false);
        break;
      
      case 'search':
        handleSearch(currentView.query, false);
        break;
      
      case 'similar':
        handleShowSimilar(currentView.track, false);
        break;
      
      default:
        break;
    }
  }, [currentView]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      await loadPlaylists();

      const savedTracksData = await getSavedTracks(20);
      const tracks = savedTracksData.items
        .filter(item => item.track)
        .map(item => formatTrack(item.track));
      
      const enrichedTracks = await enrichTracksWithFeatures(tracks);
      setFeaturedTracks(enrichedTracks);
    } catch (error) {
      console.error('Error loading initial data:', error);
      setFeaturedTracks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query, addToHistory = true) => {
    if (!query.trim()) {
      clearResults();
      setIsSearching(false);
      return;
    }

    try {
      setIsSearching(true);
      setShowSimilar(false);
      setActivePlaylist(null);

      await searchTracks(query, 50);
      
      if (searchResults.tracks && searchResults.tracks.length > 0) {
        const formattedTracks = searchResults.tracks.map(formatTrack);
        const enrichedTracks = await enrichTracksWithFeatures(formattedTracks);
      }

      if (addToHistory) {
        navigate({ type: 'search', query });
      }
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  const handleSelectPlaylist = async (playlistId, addToHistory = true) => {
    try {
      setActivePlaylist(playlistId);
      setIsSearching(false);
      setShowSimilar(false);
      clearResults();
      
      const tracks = await getPlaylistTracksHook(playlistId);
      const formattedTracks = tracks
        .filter(item => item.track)
        .map(item => formatTrack(item.track));
      
      const enrichedTracks = await enrichTracksWithFeatures(formattedTracks);
      setPlaylistTracks(enrichedTracks);

      if (addToHistory) {
        navigate({ type: 'playlist', playlistId });
      }
    } catch (error) {
      console.error('Error loading playlist:', error);
    }
  };

  // TODO - add playlist stuff
  const handleCreatePlaylist = async () => {
    console.log('Create playlist - TODO: Add modal');
  };

  const handlePlayTrack = async (track) => {
    try {
      await playTrack(track);
    } catch (error) {
      console.error('Error playing track:', error);
    }
  };

  const handlePlayFromList = async (tracks, track) => {
    try {
      const startIndex = tracks.findIndex(t => t.id === track.id);
      await playTrackList(tracks, startIndex);
    } catch (error) {
      console.error('Error playing from list:', error);
    }
  };

  const handleShowSimilar = async (track, addToHistory = true) => {
    try {
      setLoadingSimilar(true);
      setSelectedTrackForSimilar(track);
      setShowSimilar(true);
      setIsSearching(false);
      setActivePlaylist(null);
      clearResults();

      const similar = await findSimilarTracks(track.id, 20);
      setSimilarTracks(similar);

      if (addToHistory) {
        navigate({ type: 'similar', track });
      }
    } catch (error) {
      console.error('Error finding similar tracks:', error);
      setSimilarTracks([]);
    } finally {
      setLoadingSimilar(false);
    }
  };

  const handleCloseSimilar = () => {
    setShowSimilar(false);
    navigate({ type: 'home' });
  };

  const getDisplayContent = () => {
    if (showSimilar && selectedTrackForSimilar) {
      return (
        <SimilarTracks
          originalTrack={selectedTrackForSimilar}
          similarTracks={similarTracks}
          onPlay={handlePlayTrack}
          onClose={handleCloseSimilar}
        />
      );
    }

    if (isSearching && searchResults.length > 0) {
      return (
        <div>
          <h2 className="text-white text-2xl font-bold mb-4">
            Search Results ({searchResults.tracks.length})
          </h2>
          <TrackList
            tracks={searchResults.tracks}
            currentTrack={currentTrack}
            isPlaying={!isPaused}
            onPlay={(track) => handlePlayFromList(searchResults.tracks, track)}
            onShowSimilar={(track) => handleShowSimilar(track, true)}
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
            onShowSimilar={(track) => handleShowSimilar(track, true)}
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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-4">
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
            <img
              src={logo}
              alt="Logo"
              className="w-10 h-auto object-contain"
            />
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
          onSelectPlaylist={(id) => handleSelectPlaylist(id, true)}
          activePlaylist={activePlaylist}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <SearchBar onSearch={(query) => handleSearch(query, true)} />
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