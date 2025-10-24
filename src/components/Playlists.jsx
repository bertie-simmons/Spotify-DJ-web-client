import { List } from "lucide-react";

export default function Playlists({ playlists }) {
  return (
    <div className="mt-8 bg-gray-800 p-4 rounded-lg">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <List size={22} /> Your Playlists
      </h2>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {playlists.map((playlist) => (
          <div
            key={playlist.id}
            className="p-3 bg-gray-700 rounded hover:bg-gray-600 transition"
          >
            <p className="font-semibold text-sm">{playlist.name}</p>
            <p className="text-xs text-gray-400">{playlist.tracks.total} tracks</p>
          </div>
        ))}
      </div>
    </div>
  );
}