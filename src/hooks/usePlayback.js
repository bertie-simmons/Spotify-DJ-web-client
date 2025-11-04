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

};

export default usePlayback;