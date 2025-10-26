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

      {/* track rows */}
      <div className="space-y-1">
        {tracks.map((track, index) => {
          const isCurrentTrack = currentTrack?.id === track.id;
          
          return (
            <div
              key={track.id}
              className={`grid grid-cols-12 gap-4 px-4 py-3 rounded-lg hover:bg-neutral-800 transition group cursor-pointer ${
                isCurrentTrack ? 'bg-neutral-800' : ''
              }`}
              onClick={() => onPlay(track)}
            >
              {/* track number / play button */}
              <div className="col-span-1 flex items-center justify-center">
                <span className="text-gray-400 text-sm group-hover:hidden">
                  {index + 1}
                </span>
                <button 
                  className="hidden group-hover:block"
                  onClick={(e) => {
                    e.stopPropagation(); // click only plays the track
                    onPlay(track);
                  }}
                >
                  {isPlaying && isCurrentTrack ? (
                    <Pause size={16} className="text-white" />
                  ) : (
                    <Play size={16} className="text-white" />
                  )}
                </button>
              </div>

              {/* title and artist */}
              <div className="col-span-5 flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 bg-gray-700 rounded shrink-0">
                  {track.albumArt ? (
                    <img 
                      src={track.albumArt} 
                      alt={track.name} 
                      className="w-full h-full rounded"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Music size={16} className="text-gray-500" />
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <div className={`font-semibold truncate ${
                    isCurrentTrack ? 'text-spotify-green' : 'text-white'
                  }`}>
                    {track.name}
                  </div>
                  <div className="text-gray-400 text-sm truncate">
                    {track.artist}
                  </div>
                </div>
              </div>

              {/* album */}
              <div className="col-span-3 flex items-center text-gray-400 text-sm truncate">
                {track.album}
              </div>

              {/* BPM and key */}
              <div className="col-span-2 flex items-center gap-2 text-gray-400 text-sm">
                {track.bpm && <span>{track.bpm}</span>}
                {track.key && <span>• {track.key}</span>}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onShowSimilar(track);
                  }}
                  className="ml-auto opacity-0 group-hover:opacity-100 text-spotify-green hover:text-green-400 transition"
                  title="Find similar tracks"
                >
                  <TrendingUp size={16} />
                </button>
              </div>

              {/* duration */}
              <div className="col-span-1 flex items-center justify-end text-gray-400 text-sm">
                {formatDuration(track.duration)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrackList;