export default function Filters({ filters, setFilters }) {
  const handleChange = (key, value) => setFilters({ ...filters, [key]: value });

  // refine filters later
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4 bg-gray-800 p-4 rounded-lg">
      {[
        { label: "Key (0–11)", name: "key" },
        { label: "BPM", name: "bpm" },
        { label: "Energy (0–1)", name: "energy" },
        { label: "Dance (0–1)", name: "danceability" },
        { label: "Mood (0–1)", name: "valence" },
      ].map((f) => (
        <div key={f.name}>
          <label className="text-xs text-gray-400 block mb-1">{f.label}</label>
          <input
            type="number"
            step="0.1"
            min="0"
            max={f.name === "key" ? "11" : "1"}
            value={filters[f.name] || ""}
            onChange={(e) => handleChange(f.name, e.target.value)}
            className="w-full bg-gray-700 text-sm text-white px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      ))}
    </div>
  );
}