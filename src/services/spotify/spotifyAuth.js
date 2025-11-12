const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = 'http://127.0.0.1:5173/callback';
const SCOPES = 'streaming user-read-email user-read-private user-library-read user-library-modify user-read-playback-state user-modify-playback-state playlist-read-private playlist-modify-public playlist-modify-private';

const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';

// generate random string for state parameter
const generateRandomString = (length) => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], '');
};

// generate code verifier for PKCE
const generateCodeVerifier = () => {
  return generateRandomString(64);
};

// generate code challenge from verifier
const generateCodeChallenge = async (verifier) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);

  // generate SHA-256 hash
  const digest = await crypto.subtle.digest('SHA-256', data);

  // base64-url encode the hash
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
};

// redirect user to Spotify authorization
export const redirectToSpotifyAuth = async () => {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  const state = generateRandomString(16);

  // store code verifier in localStorage for later use
  localStorage.setItem('code_verifier', codeVerifier);
  localStorage.setItem('auth_state', state);

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    scope: SCOPES,
    state: state,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
  });

  window.location.href = `${AUTH_ENDPOINT}?${params.toString()}`;
};

// exchange authorization code for access token
export const exchangeCodeForToken = async (code) => {
  const codeVerifier = localStorage.getItem('code_verifier');

   if (!codeVerifier) {
    throw new Error('No code verifier found');
  }
  
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: REDIRECT_URI,
    code_verifier: codeVerifier,
  });

  try {
    const response = await fetch(TOKEN_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      throw new Error('Failed to exchange code for token');
    }

    const data = await response.json();
    
    // store token
    const expiresAt = Date.now() + data.expires_in * 1000;
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('token_expires_at', expiresAt.toString());

    // clean up
    localStorage.removeItem('code_verifier');
    localStorage.removeItem('auth_state');

    return data;
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    throw error;
  }
};

// get access token
export const getAccessToken = () => {
  return localStorage.getItem('access_token');
};

// logout user
export const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('token_expires_at');
  localStorage.removeItem('code_verifier');
  localStorage.removeItem('auth_state');
};

// check if user is authenticated
export const isAuthenticated = () => {
  const accessToken = localStorage.getItem('access_token');
  const expiresAt = localStorage.getItem('token_expires_at');

  if (!accessToken || !expiresAt) {
    return false;
  }

  return Date.now() < parseInt(expiresAt, 10);
};