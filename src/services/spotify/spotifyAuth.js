import { createContext, useState, useEffect, useContext } from "react";

// create AuthContext
export const AuthContext = createContext();

// authProvider component
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  const REDIRECT_URI = 'http://127.0.0.1:5173/callback';

  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
  const SCOPE =
    "streaming user-read-email user-read-private user-library-read user-library-modify playlist-read-private playlist-modify-public playlist-modify-private";

  // generate random string for code verifier
  const generateRandomString = (length) => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
  };

  // create SHA256 hash
  const sha256 = async (plain) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return window.crypto.subtle.digest('SHA-256', data);
  };

  // base64 encode
  const base64encode = (input) => {
    return btoa(String.fromCharCode(...new Uint8Array(input)))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  };

  // check for token on mount
  useEffect(() => {
    const storedToken = window.localStorage.getItem("spotify_token");
    const tokenExpiry = window.localStorage.getItem("token_expiry");
    
    if (storedToken && tokenExpiry) {
      // check if token is still valid
      if (Date.now() < parseInt(tokenExpiry)) {
        setToken(storedToken);
      } else {
        // token expired, clear it
        window.localStorage.removeItem("spotify_token");
        window.localStorage.removeItem("token_expiry");
      }
    }
  }, []);

  // handle callback and exchange code for token
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      const codeVerifier = window.localStorage.getItem('code_verifier');
      
      if (codeVerifier) {
        exchangeCodeForToken(code, codeVerifier);
      }
    }
  }, []);

  // exchange authorization code for access token
  const exchangeCodeForToken = async (code, codeVerifier) => {
    const payload = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
        code_verifier: codeVerifier,
      }),
    };

    try {
      const response = await fetch(TOKEN_ENDPOINT, payload);
      const data = await response.json();

      if (data.access_token) {
        const expiryTime = Date.now() + (data.expires_in * 1000);
        window.localStorage.setItem("spotify_token", data.access_token);
        window.localStorage.setItem("token_expiry", expiryTime.toString());
        window.localStorage.removeItem('code_verifier');
        
        setToken(data.access_token);
        
        // clean up URL
        window.history.replaceState({}, document.title, "/");
      }
    } catch (error) {
      console.error('Error exchanging code for token:', error);
    }
  };

  // redirect to Spotify login with PKCE
  const handleLogin = async () => {
    const codeVerifier = generateRandomString(64);
    const hashed = await sha256(codeVerifier);
    const codeChallenge = base64encode(hashed);

    // store code verifier for later use
    window.localStorage.setItem('code_verifier', codeVerifier);

    const authURL =
      `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}` +
      `&response_type=code` +
      `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
      `&scope=${encodeURIComponent(SCOPE)}` +
      `&code_challenge_method=S256` +
      `&code_challenge=${codeChallenge}`;

    window.location.href = authURL;
  };

  // logout
  const handleLogout = () => {
    setToken(null);
    window.localStorage.removeItem("spotify_token");
    window.localStorage.removeItem("token_expiry");
  };

  return (
    <AuthContext.Provider value={{ token, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to access auth context
export const useAuth = () => useContext(AuthContext);