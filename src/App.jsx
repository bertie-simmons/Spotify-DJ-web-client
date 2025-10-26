import React, { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import SearchBar from './components/layout/Searchbar';
import Player from './components/layout/Player';
import { Music } from 'lucide-react';

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activePlaylist, setActivePlaylist] = useState(null);
  const [currentTrack, setCurrentTrack] = useState({
    name: 'Example Song',
    artist: 'Example Artist',
    duration: '3:45',
    image: null
  });

  // just to be able to see  
  const demoPlaylists = [
    { id: '1', name: 'test' },
    { id: '2', name: 'test' },
    { id: '3', name: 'test' },
    { id: '4', name: 'test' },
    { id: '5', name: 'test' }
  ];
  
  const handleSearch = (query) => {
    console.log('Searching for:', query);
  };
  
  const handleCreatePlaylist = () => {
    console.log('Create new playlist');
  };
  
  return (
    <div className="h-screen flex flex-col bg-neutral-900">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar 
          playlists={demoPlaylists}
          onCreatePlaylist={handleCreatePlaylist}
          onSelectPlaylist={setActivePlaylist}
          activePlaylist={activePlaylist}
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Search Bar */}
          <SearchBar onSearch={handleSearch} />
          
          {/* Content Area */}
          <div className="flex-1 overflow-y-auto bg-linear-to-b from-neutral-900 to-black p-6">
            <h2 className="text-white text-3xl font-bold mb-6">Discover Music</h2>
            
            {/* Placeholder for track cards and content */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
                <div 
                  key={item}
                  className="bg-neutral-800 p-4 rounded-lg hover:bg-neutral-700 transition cursor-pointer group"
                >
                  <div className="aspect-square bg-gray-700 rounded mb-4 flex items-center justify-center">
                    <Music className="text-gray-500" size={48} />
                  </div>
                  <h3 className="text-white font-semibold mb-1 truncate">Track {item}</h3>
                  <p className="text-gray-400 text-sm truncate">Artist Name</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Player */}
      <Player 
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        onPlayPause={() => setIsPlaying(!isPlaying)}
        onNext={() => console.log('Next track')}
        onPrevious={() => console.log('Previous track')}
      />
    </div>
  );
}

export default App;