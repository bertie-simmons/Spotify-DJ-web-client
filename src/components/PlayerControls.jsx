import React from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

export const PlayerControls = ({ currentTrack, isPlaying, onPlayToggle, onPrev, onNext }) => {
  if (!currentTrack) return null;

  return (
    <div className="bg-gray-800 rounded-lg p-6">

      {/* now playing */}
      <h2 className="text-xl font-bold mb-4">Now Playing</h2>

      {/* album artwork */}
      {currentTrack.album?.images?.[0] && (
        <img
          src={currentTrack.album.images[0].url}
          alt={currentTrack.name}
          className="w-full rounded-lg mb-4"
        />
      )}

      {/* track name */}
      <h3 className="font-semibold text-lg mb-1">{currentTrack.name}</h3>

      {/* artist name */}
      <p className="text-gray-400 text-sm mb-4">
        {currentTrack.artists?.map((a) => a.name).join(', ')}
      </p>
      
      {/* playback controls */}
      <div className="flex items-center justify-center gap-4">
        {/* previous */}
        <button
          onClick={onPrev}
          className="p-2 hover:bg-gray-700 rounded-full transition"
        >
          <SkipBack size={24} />
        </button>
        {/* pause */}
        <button
          onClick={onPlayToggle}
          className="p-3 bg-green-600 hover:bg-green-700 rounded-full transition"
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>
        {/* next */}    
        <button
          onClick={onNext}
          className="p-2 hover:bg-gray-700 rounded-full transition"
        >
          <SkipForward size={24} />
        </button>
      </div>
    </div>
  );
};
