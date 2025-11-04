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

  
};

export default usePlayback;