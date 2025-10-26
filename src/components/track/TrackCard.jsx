import React, { useState } from 'react';
import { Play, Pause, Music } from 'lucide-react';

const TrackCard = ({ track, isPlaying, isCurrentTrack, onPlay }) => {
  const [showPlayButton, setShowPlayButton] = useState(false);

  return (
    <div 
      className="bg-neutral-800 p-4 rounded-lg hover:bg-neutral-700 transition cursor-pointer group relative"
      onMouseEnter={() => setShowPlayButton(true)}
      onMouseLeave={() => setShowPlayButton(false)}
      onClick={() => onPlay(track)}
    >
      {/* Album Art */}
      <div className="relative aspect-square bg-gray-700 rounded mb-4 overflow-hidden">
        {track.albumArt ? (
          <img 
            src={track.albumArt} 
            alt={track.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Music className="text-gray-500" size={48} />
          </div>
        )}
        
        {/* play button overlay - goes grey*/}
        <div 
          className={`absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center transition-opacity ${
            showPlayButton || isCurrentTrack ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <button 
            className="bg-spotify-green rounded-full p-3 hover:scale-110 transition shadow-lg"
            onClick={(e) => {
              e.stopPropagation();
              onPlay(track);
            }}
          >
            {isPlaying && isCurrentTrack ? (
              <Pause size={24} className="text-black" fill="black" />
            ) : (
              <Play size={24} className="text-black ml-0.5" fill="black" />
            )}
          </button>
        </div>
      </div>

    </div>
  );
};

export default TrackCard;