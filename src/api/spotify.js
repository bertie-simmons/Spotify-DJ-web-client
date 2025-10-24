export const fetchPlaylists = async (token) => {
  const res = await fetch('https://api.spotify.com/v1/me/playlists', {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  return data.items || [];
};