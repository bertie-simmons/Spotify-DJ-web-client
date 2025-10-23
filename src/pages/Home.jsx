import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import useSpotifyPlayer from "../hooks/useSpotifyPlayer";
import { searchTracks, getAudioFeatures, getRecommendations, getPlaylists } from "../api/spotify";
import SearchBar from "../components/Searchbar";
import Filters from "../components/Filters";
import TrackCard from "../components/TrackCard";
import PlaylistList from "../components/PlaylistList";
import PlayerControls from "../components/PlayerControls";

export default function Home() {
  const { token, handleLogin, handleLogout } = useContext(AuthContext);
  const { player, deviceId, currentTrack, isPlaying } = useSpotifyPlayer(token);
  const [tracks, setTracks] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [filters, setFilters] = useState({});
  const [playlists, setPlaylists] = useState([]);

  // fetch playlists
  useEffect(() => {
    if (token) getPlaylists(token).then((res) => setPlaylists(res.items));
  }, [token]);

  // login screen
  if (!token) {
    return (
      <div className="flex h-screen items-center justify-center text-white bg-gray-900">
        <button onClick={handleLogin} className="px-6 py-3 bg-green-600 rounded-lg">Login with Spotify</button>
      </div>
    );
  }

  // main app screen after login
  return (
    <div className="p-4 text-white">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">Spotify Music Finder</h1>
        <button onClick={handleLogout} className="px-4 py-2 bg-gray-700 rounded-lg">Logout</button>
      </div>

      {/* Searchbar */}
      <SearchBar onSearch={async (query) => {
        const data = await searchTracks(token, query);
        const tracksWithFeatures = await Promise.all(
          data.tracks.items.map(async (t) => ({ ...t, features: await getAudioFeatures(token, t.id) }))
        );
        setTracks(tracksWithFeatures);
      }} />

      <Filters filters={filters} setFilters={setFilters} />

      {/* Search results */}
      {tracks.length > 0 && (
        <div className="mt-6 space-y-4">
          {tracks.map((t) => (
            <TrackCard key={t.id} track={t} onRecommend={() => {
              getRecommendations(token, t.id, filters).then((res) => setRecommendations(res.tracks));
            }} />
          ))}
        </div>
      )}

      {/* recommendations */}
      {recommendations.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl mb-3 font-semibold">Recommendations</h2>
          <div className="space-y-4">
            {recommendations.map((r) => <TrackCard key={r.id} track={r} />)}
          </div>
        </div>
      )}

      {/* player Controls */}
      {currentTrack && (
        <PlayerControls player={player} isPlaying={isPlaying} currentTrack={currentTrack} />
      )}

      {/* playlists */}
      <PlaylistList playlists={playlists} />
    </div>
  );
}
