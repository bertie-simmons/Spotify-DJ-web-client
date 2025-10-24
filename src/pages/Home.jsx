import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import useSpotifyPlayer from '../hooks/useSpotifyPlayer';
import { searchTracks, getAudioFeatures, getRecommendations, getPlaylists } from '../api/spotify';
import TrackCard from '../components/TrackCard';
import { Music, Search } from 'lucide-react';

export const Home = () => {
  const { token, handleLogin, handleLogout } = useAuth();
  const { player, deviceId, currentTrack, isPlaying } = useSpotifyPlayer(token);

  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});
  const [results, setResults] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    if (token) getPlaylists(token).then(setPlaylists);
  }, [token]);

  const handleSearch = async () => {
    const tracks = await searchTracks(token, searchQuery);
    const enriched = await Promise.all(
      tracks.map(async (track) => ({
        ...track,
        features: await getAudioFeatures(token, track.id),
      }))
    );
    setResults(enriched);
  };

  if (!token)
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-6">
        <div className="text-center">
          <Music size={64} className="text-green-500 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-white mb-4">Spotify Music Finder</h1>
          <p className="text-gray-300 mb-8">Discover music by key, BPM, and energy</p>
          <button onClick={handleLogin} className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full">
            Login with Spotify
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Music size={32} className="text-green-500" />
            <h1 className="text-3xl font-bold">Spotify Music Finder</h1>
          </div>
          <button onClick={handleLogout} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition">
            Logout
          </button>
        </div>

        <div className="flex gap-3 mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search for songs..."
            className="flex-1 px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button onClick={handleSearch} className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition flex items-center gap-2">
            <Search size={20} /> Search
          </button>
        </div>

        {results.length > 0 && (
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Search Results</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {results.map(track => (
                <div key={track.id}>
                  <TrackCard track={track} token={token} deviceId={deviceId} />
                  <button
                    onClick={async () => {
                      const recs = await getRecommendations(token, track.id, filters);
                      const recsWithFeatures = await Promise.all(
                        recs.map(async (t) => ({
                          ...t,
                          features: await getAudioFeatures(token, t.id),
                        }))
                      );
                      setRecommendations(recsWithFeatures);
                    }}
                    className="mt-2 px-4 py-1 bg-purple-600 hover:bg-purple-700 rounded text-sm transition"
                  >
                    Get Recommendations
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {recommendations.length > 0 && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Recommendations</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {recommendations.map(track => (
                <TrackCard key={track.id} track={track} token={token} deviceId={deviceId} playlists={playlists} showAddButton />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;