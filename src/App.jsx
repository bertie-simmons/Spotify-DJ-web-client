import React, { useContext } from "react";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import Home from "./pages/Home";
import useSpotifyPlayer from "./hooks/useSpotifyPlayer";

function AppContent() {
  const { token, handleLogin, handleLogout } = useContext(AuthContext);

  // initialize playback SDK when token is available
  const { player, deviceId, currentTrack, isPlaying } = useSpotifyPlayer(token);

  // pass these values as props to home page
  return (
    <Home
      token={token}
      handleLogin={handleLogin}
      handleLogout={handleLogout}
      player={player}
      deviceId={deviceId}
      currentTrack={currentTrack}
      isPlaying={isPlaying}
    />
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
