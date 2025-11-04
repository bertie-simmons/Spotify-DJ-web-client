import React, { useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Heart, Music } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { formatDuration } from '../../services/utils/formatters';

const Player = () => {
  const { 
    currentTrack, 
    isPaused, 
    position, 
    duration, 
    volume,
    togglePlay,
    next,
    previous,
    seek,
    changeVolume,
    isReady,
  } = usePlayer();

  const [liked, setLiked] = React.useState(false);

  // Calculate progress percentage
  const progressPercentage = duration > 0 ? (position / duration) * 100 : 0;

  const handleProgressClick = (e) => {
    if (!duration) return;
    const progressBar = e.currentTarget;
    const clickPosition = e.nativeEvent.offsetX;
    const progressBarWidth = progressBar.offsetWidth;
    const newPosition = (clickPosition / progressBarWidth) * duration;
    seek(newPosition);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    changeVolume(newVolume);
  };

  if (!isReady) {
    return (
      <div className="bg-neutral-900 border-t border-gray-800 px-4 py-3">
        <div className="flex items-center justify-center">
          <p className="text-gray-400 text-sm">Initializing player...</p>
        </div>
      </div>
    );
  }

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
            disabled={!currentTrack}
          >
            <Heart size={20} fill={liked ? 'currentColor' : 'none'} />
          </button>
        </div>
        
        {/* Playback Controls */}
        <div className="flex flex-col items-center gap-2 flex-1">
          <div className="flex items-center gap-4">
            <button 
              onClick={previous}
              className="text-gray-400 hover:text-white transition disabled:opacity-50"
              disabled={!currentTrack}
            >
              <SkipBack size={20} />
            </button>
            
            <button 
              onClick={togglePlay}
              className="bg-white rounded-full p-2 hover:scale-105 transition disabled:opacity-50"
              disabled={!currentTrack}
            >
              {!isPaused ? (
                <Pause size={20} className="text-black" fill="black" />
              ) : (
                <Play size={20} className="text-black ml-0.5" fill="black" />
              )}
            </button>
            
            <button 
              onClick={next}
              className="text-gray-400 hover:text-white transition disabled:opacity-50"
              disabled={!currentTrack}
            >
              <SkipForward size={20} />
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="flex items-center gap-2 w-full max-w-md">
            <span className="text-xs text-gray-400">
              {formatDuration(position)}
            </span>
            <div 
              className="flex-1 bg-gray-700 h-1 rounded-full overflow-hidden cursor-pointer"
              onClick={handleProgressClick}
            >
              <div 
                className="bg-white h-full rounded-full transition-all"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <span className="text-xs text-gray-400">
              {formatDuration(duration)}
            </span>
          </div>
        </div>
        
        {/* Volume Control */}
        <div className="flex items-center gap-2 flex-1 justify-end">
          <Volume2 size={20} className="text-gray-400" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-24 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-white"
          />
        </div>
      </div>
    </div>
  );
};

export default Player;