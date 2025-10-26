import React, { useState } from 'react';
import { Music } from 'lucide-react';
import TrackCard from './TrackCard';

const SimilarTracks = ({ originalTrack, similarTracks, onPlay, onClose }) => {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filteredTracks = similarTracks.filter(track => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'bpm') return Math.abs(track.bpm - originalTrack.bpm) <= 5;
    if (selectedFilter === 'key') return track.key === originalTrack.key;
    if (selectedFilter === 'genre') return track.genre === originalTrack.genre;
    return true;
  });

  return (
    <div className="bg-neutral-900 rounded-lg p-6">
      {/* header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white text-2xl font-bold mb-2">
            Similar to "{originalTrack.name}"
          </h2>
          <p className="text-gray-400 text-sm">
            Found {similarTracks.length} similar tracks
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition"
        >
          ✕
        </button>
      </div>

      {/* original track info */}
      <div className="bg-neutral-800 rounded-lg p-4 mb-6 flex items-center gap-4">
        <div className="w-16 h-16 bg-gray-700 rounded shrink-0">
          {originalTrack.albumArt ? (
            <img 
              src={originalTrack.albumArt} 
              alt={originalTrack.name}
              className="w-full h-full rounded"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Music className="text-gray-500" size={24} />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-white font-semibold truncate">{originalTrack.name}</div>
          <div className="text-gray-400 text-sm truncate">{originalTrack.artist}</div>
        </div>
        <div className="flex gap-4 text-sm text-gray-400">
          {originalTrack.bpm && <span>{originalTrack.bpm} BPM</span>}
          {originalTrack.key && <span>{originalTrack.key}</span>}
          {originalTrack.genre && <span>{originalTrack.genre}</span>}
        </div>
      </div>

      {/* filters */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setSelectedFilter('all')}
          className={`px-4 py-2 rounded-full text-sm transition ${
            selectedFilter === 'all'
              ? 'bg-white text-black'
              : 'bg-neutral-800 text-white hover:bg-neutral-700'
          }`}
        >
          All ({similarTracks.length})
        </button>
        <button
          onClick={() => setSelectedFilter('bpm')}
          className={`px-4 py-2 rounded-full text-sm transition ${
            selectedFilter === 'bpm'
              ? 'bg-white text-black'
              : 'bg-neutral-800 text-white hover:bg-neutral-700'
          }`}
        >
          Similar BPM
        </button>
        <button
          onClick={() => setSelectedFilter('key')}
          className={`px-4 py-2 rounded-full text-sm transition ${
            selectedFilter === 'key'
              ? 'bg-white text-black'
              : 'bg-neutral-800 text-white hover:bg-neutral-700'
          }`}
        >
          Same Key
        </button>
        <button
          onClick={() => setSelectedFilter('genre')}
          className={`px-4 py-2 rounded-full text-sm transition ${
            selectedFilter === 'genre'
              ? 'bg-white text-black'
              : 'bg-neutral-800 text-white hover:bg-neutral-700'
          }`}
        >
          Same Genre
        </button>
      </div>

      {/* similar tracks grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
        {filteredTracks.map((track) => (
          <TrackCard
            key={track.id}
            track={track}
            isPlaying={false}
            isCurrentTrack={false}
            onPlay={onPlay}
          />
        ))}
      </div>
    </div>
  );
};

export default SimilarTracks;