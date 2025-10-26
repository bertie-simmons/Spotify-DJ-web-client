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
        
      </div>
    </div>
  );
};

export default Player;