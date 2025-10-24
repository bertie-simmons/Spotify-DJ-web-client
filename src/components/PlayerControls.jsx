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
    </div>
  );
};
