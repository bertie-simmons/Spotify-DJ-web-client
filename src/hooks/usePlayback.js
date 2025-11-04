import { useState, useCallback } from 'react';
import { usePlayer } from '../context/PlayerContext';

export const usePlayback = () => {
  const { play, playMultiple, togglePlay, next, previous } = usePlayer();
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // play a single track
  const playTrack = useCallback(async (track) => {
    try {
      await play(track.uri);
      setQueue([track]);
      setCurrentIndex(0);
    } catch (error) {
      console.error('Failed to play track:', error);
    }
  }, [play]);

  // play a list of tracks starting from a specific index
  const playTrackList = useCallback(async (tracks, startIndex = 0) => {
    try {
      const uris = tracks.map(t => t.uri);
      await playMultiple(uris, startIndex);
      setQueue(tracks);
      setCurrentIndex(startIndex);
    } catch (error) {
      console.error('Failed to play track list:', error);
    }
  }, [playMultiple]);

  // Play next track in queue
  const playNext = useCallback(async () => {
    if (currentIndex < queue.length - 1) {
      await next();
      setCurrentIndex(prev => prev + 1);
    }
  }, [next, currentIndex, queue.length]);

  // Play previous track in queue
  const playPrevious = useCallback(async () => {
    if (currentIndex > 0) {
      await previous();
      setCurrentIndex(prev => prev - 1);
    }
  }, [previous, currentIndex]);

  // Add track to queue
  const addToQueue = useCallback((track) => {
    setQueue(prev => [...prev, track]);
  }, []);

  // Clear queue
  const clearQueue = useCallback(() => {
    setQueue([]);
    setCurrentIndex(0);
  }, []);

  return {
    queue,
    currentIndex,
    playTrack,
    playTrackList,
    playNext,
    playPrevious,
    togglePlay,
    addToQueue,
    clearQueue,
  };
};

export default usePlayback;