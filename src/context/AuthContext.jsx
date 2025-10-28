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

  // Fetch user profile
  const fetchUserProfile = async () => {
    try {
      const token = await getAccessToken();
      if (!token) {
        setIsLoggedIn(false);
        return;
      }

      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUser({
          id: data.id,
          displayName: data.display_name,
          email: data.email,
          image: data.images?.[0]?.url,
          country: data.country,
          product: data.product
        });
      } else {
        throw new Error('Failed to fetch user profile');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      logout();
    }
  };

  const login = () => {
    redirectToSpotifyAuth();
  };

  const logout = () => {
    logoutService();
    setIsLoggedIn(false);
    setUser(null);
  };

  const value = {
    isLoggedIn,
    loading,
    user,
    login,
    logout,
    refreshUser: fetchUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 