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