import { Play, Plus } from "lucide-react";

export default function TrackCard({ track, onRecommend, onAdd, playlists = [] }) {
  const getKeyName = (key) => {
    const keys = ["C", "C♯/D♭", "D", "D♯/E♭", "E", "F", "F♯/G♭", "G", "G♯/A♭", "A", "A♯/B♭", "B"];
    return keys[key] || "Unknown";
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg flex items-center gap-4 hover:bg-gray-700 transition">
      {track.album?.images?.[0] && (
        // album art
        <img
          src={track.album.images[0].url}
          alt={track.name}
          className="w-16 h-16 rounded"
        />
      )}

    </div>
  );
}
