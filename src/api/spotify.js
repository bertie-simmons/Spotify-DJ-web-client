export const fetchPlaylists = async (token) => {
  const res = await fetch('https://api.spotify.com/v1/me/playlists', {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  return data.items || [];
};

export const searchTracks = async (token, query) => {
  const res = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=20`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const data = await res.json();
  return data.tracks.items;
};

// bpm, key, energy, danceability, valence
export const getAudioFeatures = async (token, trackId) => {
  const res = await fetch(`https://api.spotify.com/v1/audio-features/${trackId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

export const getRecommendations = async (token, seedTrackId, filters = {}) => {
  let url = `https://api.spotify.com/v1/recommendations?seed_tracks=${seedTrackId}&limit=20`;
  if (filters.key) url += `&target_key=${filters.key}`;
  if (filters.bpm) url += `&target_tempo=${filters.bpm}`;
  if (filters.energy) url += `&target_energy=${filters.energy}`;
  if (filters.danceability) url += `&target_danceability=${filters.danceability}`;
  if (filters.valence) url += `&target_valence=${filters.valence}`;

  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  const data = await res.json();
  return data.tracks;
};

export const playTrack = async (token, deviceId, uri) => {
  await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ uris: [uri] }),
  });
};


export const addToPlaylist = async (token, playlistId, uri) => {
  await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ uris: [uri] }),
  });
};