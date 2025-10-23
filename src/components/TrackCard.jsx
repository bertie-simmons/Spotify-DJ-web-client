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

      {/* track info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-white truncate">{track.name}</h3>
        <p className="text-sm text-gray-400 truncate">
          {track.artists?.map((a) => a.name).join(", ")}
        </p>

        {/* track features */}
        {track.features && (
          <div className="flex gap-3 mt-2 text-xs text-gray-400">
            <span>Key: {getKeyName(track.features.key)}</span>
            <span>BPM: {Math.round(track.features.tempo)}</span>
            <span>Energy: {(track.features.energy * 100).toFixed(0)}%</span>
          </div>
        )}
      </div>

    </div>
  );
}
