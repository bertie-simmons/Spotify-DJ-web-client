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
      
    </div>
  );
};

export default SimilarTracks;