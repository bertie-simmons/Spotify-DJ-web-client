import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { exchangeCodeForToken } from '../services/spotify/spotifyAuth';
import logo from '../assets/Spotify_Primary_Logo_RGB_Green.png';

const Callback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const hasProcessed = useRef(false);

  useEffect(() => {
    // prevents double login
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const state = params.get('state');
      const error = params.get('error');

      // check for errors on spotify end
      if (error) {
        setError('Authentication failed. Please try again.');
        setTimeout(() => navigate('/'), 3000);
        return;
      }

      // verify state - CSRF attacks
      const savedState = localStorage.getItem('auth_state');
      if (state !== savedState) {
        setError('State mismatch. Authentication failed.');
        setTimeout(() => navigate('/'), 3000);
        return;
      }

      if (!code) {
        console.error('No authorization code received');
        setError('No authorization code received');
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      try {
        console.log('Starting token exchange...');
        await exchangeCodeForToken(code);
        console.log('Token exchange successful, redirecting to home');
        
        // ensure token is saved with delay
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 100);
      } catch (err) {
        console.error('Error during token exchange:', err);
        setError('Failed to authenticate. Please try again.');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        {error ? (
          <div>
            <div className="text-red-500 text-xl mb-4">{error}</div>
            <p className="text-gray-400">Redirecting...</p>
          </div>
        ) : (
          <div>
            <div className="mb-6 flex justify-center">
              <div className="animate-spin">
                <img
                  src={logo}
                  alt="Logo"
                  className="w-10 h-auto object-contain"
                />
            </div>
            </div>
            <h2 className="text-white text-2xl font-bold mb-2">
              Authenticating...
            </h2>
            <p className="text-gray-400">
              Please wait while we log you in
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Callback;