import { SkipBack, SkipForward, Play, Pause } from "lucide-react";

export default function PlayerControls({ player, currentTrack, isPlaying }) {
  if (!currentTrack) return null;

  const { name, artists, album } = currentTrack;

  return (
    <div>
        
    </div>
  );
}
