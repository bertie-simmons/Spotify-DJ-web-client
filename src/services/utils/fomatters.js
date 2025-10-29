// Format duration from milliseconds to MM:SS
export const formatDuration = (ms) => {
  if (!ms) return '0:00';
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}:${seconds.padStart(2, '0')}`;
};

// Format large numbers - followers, plays
export const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

// Format track for display
export const formatTrack = (track) => {
  return {
    id: track.id,
    name: track.name,
    artist: track.artists?.map(a => a.name).join(', ') || 'Unknown Artist',
    album: track.album?.name || 'Unknown Album',
    albumArt: track.album?.images?.[0]?.url || null,
    duration: track.duration_ms,
    uri: track.uri,
    previewUrl: track.preview_url,
  };
};

// Format playlist for display
export const formatPlaylist = (playlist) => {
  return {
    id: playlist.id,
    name: playlist.name,
    description: playlist.description,
    image: playlist.images?.[0]?.url || null,
    trackCount: playlist.tracks?.total || 0,
    owner: playlist.owner?.display_name || 'Unknown',
    public: playlist.public,
    uri: playlist.uri,
  };
};

// Format artist for display
export const formatArtist = (artist) => {
  return {
    id: artist.id,
    name: artist.name,
    image: artist.images?.[0]?.url || null,
    followers: artist.followers?.total || 0,
    genres: artist.genres || [],
    popularity: artist.popularity || 0,
    uri: artist.uri,
  };
};

// Extract track ID from Spotify URI
export const extractTrackId = (uri) => {
  if (!uri) return null;
  if (uri.startsWith('spotify:track:')) {
    return uri.split(':')[2];
  }
  return uri;
};

// Convert track IDs to Spotify URIs
export const toSpotifyUri = (id, type = 'track') => {
  return `spotify:${type}:${id}`;
};