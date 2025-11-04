import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { 
  initializePlayer, 
  disconnectPlayer, 
  playTrack as playTrackService,
  playTracks as playTracksService,
  togglePlay as togglePlayService,
  nextTrack as nextTrackService,
  previousTrack as previousTrackService,
  seek as seekService,
  setVolume as setVolumeService,
  getCurrentState,
  getDeviceId,
  transferPlayback,
} from '../services/spotify/spotifyPlayer';
import { getAccessToken } from '../services/spotify/spotifyAuth';

const PlayerContext = createContext();

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};

export const PlayerProvider = ({ children }) => {
  const { isLoggedIn } = useAuth();
  
  const [isReady, setIsReady] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [deviceId, setDeviceId] = useState(null);

  // initialize player when logged in
  useEffect(() => {
    if (!isLoggedIn) {
      disconnectPlayer();
      setIsReady(false);
      return;
    }

    const setupPlayer = async () => {
      try {
        const token = await getAccessToken();
        if (!token) return;

        const id = await initializePlayer(token, {
          onReady: (device_id) => {
            console.log('Player ready with device ID:', device_id);
            setDeviceId(device_id);
            setIsReady(true);
          },
          onNotReady: (device_id) => {
            console.log('Device offline:', device_id);
            setIsReady(false);
          },
          onStateChange: (state) => {
            if (!state) {
              setIsActive(false);
              return;
            }

            setIsActive(true);
            setIsPaused(state.paused);
            setPosition(state.position);
            setDuration(state.duration);

            const track = state.track_window.current_track;
            if (track) {
              setCurrentTrack({
                id: track.id,
                name: track.name,
                artist: track.artists.map(a => a.name).join(', '),
                album: track.album.name,
                image: track.album.images[0]?.url,
                uri: track.uri,
                duration: state.duration,
              });
            }
          },
          onError: (error) => {
            console.error('Player error:', error);
          },
        });

        // auto-transfer playback to this device
        setTimeout(() => {
          transferPlayback().catch(err => 
            console.log('Could not transfer playback:', err)
          );
        }, 1000);

      } catch (error) {
        console.error('Failed to initialize player:', error);
      }
    };

    setupPlayer();

    return () => {
      disconnectPlayer();
    };
  }, [isLoggedIn]);

  // Update position every second when playing
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(async () => {
      const state = await getCurrentState();
      if (state) {
        setPosition(state.position);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused]);

  // Play a track
  const play = useCallback(async (trackUri) => {
    try {
      await playTrackService(trackUri);
    } catch (error) {
      console.error('Error playing track:', error);
      throw error;
    }
  }, []);

  // Play multiple tracks
  const playMultiple = useCallback(async (trackUris, startIndex = 0) => {
    try {
      const urisToPlay = trackUris.slice(startIndex);
      await playTracksService(urisToPlay);
    } catch (error) {
      console.error('Error playing tracks:', error);
      throw error;
    }
  }, []);

  // Toggle play/pause
  const togglePlay = useCallback(async () => {
    try {
      await togglePlayService();
    } catch (error) {
      console.error('Error toggling play:', error);
    }
  }, []);

  // Next track
  const next = useCallback(async () => {
    try {
      await nextTrackService();
    } catch (error) {
      console.error('Error skipping to next:', error);
    }
  }, []);

  // Previous track
  const previous = useCallback(async () => {
    try {
      await previousTrackService();
    } catch (error) {
      console.error('Error skipping to previous:', error);
    }
  }, []);

  // Seek to position
  const seek = useCallback(async (positionMs) => {
    try {
      await seekService(positionMs);
      setPosition(positionMs);
    } catch (error) {
      console.error('Error seeking:', error);
    }
  }, []);

  // Change volume
  const changeVolume = useCallback(async (newVolume) => {
    try {
      await setVolumeService(newVolume);
      setVolume(newVolume);
    } catch (error) {
      console.error('Error changing volume:', error);
    }
  }, []);

  const value = {
    isReady,
    isPaused,
    isActive,
    currentTrack,
    position,
    duration,
    volume,
    deviceId,
    play,
    playMultiple,
    togglePlay,
    next,
    previous,
    seek,
    changeVolume,
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
};