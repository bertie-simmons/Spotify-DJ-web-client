import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  redirectToSpotifyAuth, 
  isAuthenticated, 
  logout as logoutService,
  getAccessToken 
} from '../services/spotify/spotifyAuth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = isAuthenticated();
      setIsLoggedIn(authenticated);

      if (authenticated) {
        await fetchUserProfile();
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  