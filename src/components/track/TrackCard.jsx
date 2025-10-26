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
        
        
      </div>

    </div>
  );
};

export default TrackCard;