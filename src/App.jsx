import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Callback from './pages/Callback';
import { Music } from 'lucide-react';

// Login page component
const Login = () => {
  const { login } = useAuth();

  return (
    <div className="min-h-screen bg-linear-to-b from-neutral-900 to-black flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8 flex justify-center">
          <Music size={80} className="text-spotify-green" />
        </div>
        <h1 className="text-white text-5xl font-bold mb-4">
          Spotify Music Finder
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
      </div>
    </div>
  );
};

export default App;