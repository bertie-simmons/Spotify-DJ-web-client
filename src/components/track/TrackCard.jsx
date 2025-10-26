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
      
      {/* buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => onRecommend?.(track)}
          className="p-2 bg-purple-600 hover:bg-purple-700 rounded-full transition"
          title="Get Recommendations"
        >
          <Play size={16} />
        </button>

        {onAdd && (
          <div className="relative group">
            <button className="p-2 bg-blue-600 hover:bg-blue-700 rounded-full transition">
              <Plus size={16} />
            </button>
            <div className="hidden group-hover:block absolute right-0 mt-2 w-48 bg-gray-900 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
              {playlists.map((p) => (
                <button
                  key={p.id}
                  onClick={() => onAdd(track.uri, p.id)}
                  className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-800"
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
