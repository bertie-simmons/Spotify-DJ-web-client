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
      
    </div>
  );
};

export default TrackCard;