import { Play, Plus } from "lucide-react";

export default function TrackCard({ track, onRecommend, onAdd, playlists = [] }) {
  const getKeyName = (key) => {
    const keys = ["C", "C♯/D♭", "D", "D♯/E♭", "E", "F", "F♯/G♭", "G", "G♯/A♭", "A", "A♯/B♭", "B"];
    return keys[key] || "Unknown";
  };

  return (
    
  );
}
