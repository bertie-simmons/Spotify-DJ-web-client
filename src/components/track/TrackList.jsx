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
      {/* table header */}
      <div className="grid grid-cols-12 gap-4 px-4 py-2 text-gray-400 text-sm border-b border-gray-800 mb-2">
        <div className="col-span-1 text-center">#</div>
        <div className="col-span-5">Title</div>
        <div className="col-span-3">Album</div>
        <div className="col-span-2">BPM / Key</div>
        <div className="col-span-1 flex justify-end">
          <Clock size={16} />
        </div>
      </div>

      
    </div>
  );
};

export default TrackList;