import React, { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import SearchBar from '../components/layout/SearchBar';
import Player from '../components/layout/Player';
import TrackCard from '../components/track/TrackCard';
import { useAuth } from '../context/AuthContext';
import { Music } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);
  const [activePlaylist, setActivePlaylist] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);

  const demoPlaylists = [
    { id: '1', name: 'My Liked Songs' },
    { id: '2', name: 'Chill Vibes' },
    { id: '3', name: 'Workout Mix' },
    { id: '4', name: 'Focus Music' },
    { id: '5', name: 'Party Hits' }
  ];

  const demoTracks = Array.from({ length: 20 }, (_, i) => ({
    id: `track-${i}`,
    name: `Track ${i + 1}`,
    artist: 'Artist Name',
    albumArt: null
  }));

  const handleSearch = (query) => {
    console.log('Searching for:', query);
    // Will implement with Spotify API
  };

  const handleCreatePlaylist = () => {
    console.log('Create new playlist');
    // Will implement with Spotify API
  };

  const handlePlay = (track) => {
    if (currentTrack?.id === track.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-neutral-900">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          playlists={demoPlaylists}
          onCreatePlaylist={handleCreatePlaylist}
          onSelectPlaylist={setActivePlaylist}
          activePlaylist={activePlaylist}
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <SearchBar onSearch={handleSearch} />
          
          <div className="flex-1 overflow-y-auto bg-gradient-to-b from-neutral-900 to-black p-6">
            <div className="mb-6">
              <h2 className="text-white text-3xl font-bold mb-2">
                Welcome back{user?.displayName ? `, ${user.displayName}` : ''}
              </h2>
              <p className="text-gray-400">Discover music based on BPM, key, and genre</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {demoTracks.map((track) => (
                <TrackCard
                  key={track.id}
                  track={track}
                  isPlaying={isPlaying}
                  isCurrentTrack={currentTrack?.id === track.id}
                  onPlay={handlePlay}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <Player 
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        onPlayPause={() => setIsPlaying(!isPlaying)}
        onNext={() => console.log('Next track')}
        onPrevious={() => console.log('Previous track')}
      />
    </div>
  );
};

export default Home;