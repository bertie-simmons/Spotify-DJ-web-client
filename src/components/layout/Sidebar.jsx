import React from 'react';
import { Home, Plus, Music } from 'lucide-react';

const Sidebar = ({ playlists, onCreatePlaylist, onSelectPlaylist, activePlaylist }) => {
  return (
    <div className="w-64 bg-black h-full flex flex-col p-6">
      <div className="mb-8">
        <h1 className="text-white text-2xl font-bold">Spotify Music Finder</h1>
      </div>
      
      <nav className="flex-1">
        <button className="flex items-center gap-4 text-gray-300 hover:text-white w-full p-3 rounded-lg hover:bg-gray-800 transition mb-2">
          <Home size={24} />
          <span className="font-semibold">Home</span>
        </button>
        
        <div className="mt-8 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-400 text-sm font-semibold uppercase">Your Playlists</h2>
            <button 
              onClick={onCreatePlaylist}
              className="text-gray-400 hover:text-white transition"
            >
              <Plus size={20} />
            </button>
          </div>
          
          <div className="space-y-1 max-h-96 overflow-y-auto">
            {playlists.map((playlist) => (
              <button
                key={playlist.id}
                onClick={() => onSelectPlaylist(playlist.id)}
                className={`w-full text-left p-3 rounded-lg transition ${
                  activePlaylist === playlist.id 
                    ? 'bg-gray-800 text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Music size={16} />
                  <span className="truncate text-sm">{playlist.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;