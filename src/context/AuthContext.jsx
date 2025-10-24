import { createContext, useState, useEffect, useContext } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState('');
  const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";
  const SCOPE =
    "streaming user-read-email user-read-private user-library-read user-library-modify playlist-read-private playlist-modify-public playlist-modify-private";

  useEffect(() => {
  const hash = window.location.hash;
  if (hash) {
    // Only parse if there's actually a hash
    const tokenFromHash = hash
      .substring(1)
      .split("&")
      .find(elem => elem.startsWith("access_token"))
      ?.split("=")[1];

    if (tokenFromHash) {
      window.localStorage.setItem("spotify_token", tokenFromHash);
      setToken(tokenFromHash);
      window.location.hash = "";
    }
  } else {
    // Fallback: maybe token is already stored
    const storedToken = window.localStorage.getItem("spotify_token");
    if (storedToken) {
      setToken(storedToken);
    }
  }
}, []);

  const handleLogin = () => {
    window.location = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;
  };

  const handleLogout = () => {
    setToken(null);
    window.localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ token, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);