import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PlayerProvider } from './context/PlayerContext';
import { NavigationProvider } from './context/NavigationContext';
import Home from './pages/Home';
import Callback from './pages/Callback';
import logo from './assets/Spotify_Primary_Logo_RGB_Green.png';

// Login page component
const Login = () => {
  const { login } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-900 to-black flex items-center justify-center">
      <div className="text-center">
        <div className="mb-9 flex justify-center">
          <img
            src={logo}
            alt="Logo"
            className="w-20 object-contain"
          />
        </div>
        <h1 className="text-white text-5xl font-bold mb-4">
          Music Discovery
        </h1>
        <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
          Discover similar songs based on BPM, key, and genre using Spotify
        </p>
        <button
          onClick={login}
          className="bg-spotify-green text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-green-500 transition transform hover:scale-105"
        >
          Login with Spotify
        </button>
        <p className="text-gray-500 text-sm mt-4">
          Requires Spotify Premium for playback
        </p>
      </div>
    </div>
  );
};

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin">
          <img
            src={logo}
            alt="Logo"
            className="w-10 h-auto object-contain"
          />
        </div>
      </div>
    );
  }

  return isLoggedIn ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <PlayerProvider>
        <NavigationProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/callback" element={<Callback />} />
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </Router>
        </NavigationProvider>
      </PlayerProvider>
    </AuthProvider>
  );
}

export default App;