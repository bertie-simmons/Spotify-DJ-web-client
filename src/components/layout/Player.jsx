import React, { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Heart, Music } from 'lucide-react';

const Player = ({ currentTrack, isPlaying, onPlayPause, onNext, onPrevious }) => {
  const [volume, setVolume] = useState(70);
  const [liked, setLiked] = useState(false);
  
  return (
    <div className="bg-neutral-900 border-t border-gray-800 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Track Info */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="w-14 h-14 bg-gray-800 rounded flex items-center justify-center flex-shrink-0">
            {currentTrack?.image ? (
              <img src={currentTrack.image} alt={currentTrack.name} className="w-full h-full rounded" />
            ) : (
              <Music className="text-gray-600" size={24} />
            )}
          </div>
          <div className="min-w-0">
            <div className="text-white text-sm font-semibold truncate">
              {currentTrack?.name || 'No track playing'}
            </div>
            <div className="text-gray-400 text-xs truncate">
              {currentTrack?.artist || 'Select a song to play'}
            </div>
          </div>
          <button 
            onClick={() => setLiked(!liked)}
            className="ml-2 text-gray-400 hover:text-white transition flex-shrink-0"
          >
            <Heart size={20} fill={liked ? 'currentColor' : 'none'} />
          </button>
        </div>
        
        {/* Playback Controls */}
        <div className="flex flex-col items-center gap-2 flex-1">
          <div className="flex items-center gap-4">
            <button 
              onClick={onPrevious}
              className="text-gray-400 hover:text-white transition"
              disabled={!currentTrack}
            >
              <SkipBack size={20} />
            </button>
            
            <button 
              onClick={onPlayPause}
              className="bg-white rounded-full p-2 hover:scale-105 transition disabled:opacity-50"
              disabled={!currentTrack}
            >
              {isPlaying ? (
                <Pause size={20} className="text-black" fill="black" />
              ) : (
                <Play size={20} className="text-black" fill="black" />
              )}
            </button>
            
            <button 
              onClick={onNext}
              className="text-gray-400 hover:text-white transition"
              disabled={!currentTrack}
            >
              <SkipForward size={20} />
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="flex items-center gap-2 w-full max-w-md">
            <span className="text-xs text-gray-400">0:00</span>
            <div className="flex-1 bg-gray-700 h-1 rounded-full overflow-hidden">
              <div className="bg-white h-full w-0 rounded-full"></div>
            </div>
            <span className="text-xs text-gray-400">
              {currentTrack?.duration || '0:00'}
            </span>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Player;