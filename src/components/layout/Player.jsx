import React, { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Heart, Music } from 'lucide-react';

const Player = ({ currentTrack, isPlaying, onPlayPause, onNext, onPrevious }) => {
  const [volume, setVolume] = useState(70);
  const [liked, setLiked] = useState(false);
  
  return (
    <div className="bg-neutral-900 border-t border-gray-800 px-4 py-3">
      
    </div>
  );
};

export default Player;