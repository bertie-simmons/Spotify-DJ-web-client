import React from 'react';
import { Play, Pause, Music, Clock, TrendingUp } from 'lucide-react';

const TrackList = ({ tracks, currentTrack, isPlaying, onPlay, onShowSimilar }) => {
  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds.padStart(2, '0')}`;
  };

  return (
    <div className="w-full">
      
    </div>
  );
};

export default TrackList;