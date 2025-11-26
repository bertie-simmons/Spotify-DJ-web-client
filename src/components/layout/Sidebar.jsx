import React from 'react';
import { Home, Plus, Music } from 'lucide-react';

const Sidebar = ({ playlists, onCreatePlaylist, onSelectPlaylist, activePlaylist }) => {
  return (
    <div className="w-64 bg-black h-full flex flex-col p-4 rounded-lg">
      
      <nav className="flex-1">
        
        <div className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-400 text-sm font-semibold uppercase">Your Library</h2>
            <button 
              onClick={onCreatePlaylist}
              className="text-gray-400 hover:text-white transition"
            >
              <Plus size={20} />
            </button>
          </div>
          
          <div className="space-y-1 max-h-[78vh] overflow-y-auto">
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