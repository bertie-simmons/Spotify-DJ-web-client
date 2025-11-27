import React, { useState } from 'react';
import { Search, LogOut, User } from 'lucide-react';
import NavigationButtons from './NavigationButtons';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/Spotify_Primary_Logo_RGB_Green.png';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const { user, logout } = useAuth();
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSearch(query);
    }
  };

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
  };
  
  return (
    <div className="fixed top-0 left-0 w-full bg-neutral-900 p-4 z-50 shadow-lg">

      <div className="flex items-center justify-between w-full gap-4">
        
        {/* logo */}
        <div className="flex items-center shrink-0">
          <img
            src={logo}
            alt="Logo"
            className="w-10 h-auto object-contain"
          />
        </div>

        {/* Navigation buttons */}
        <NavigationButtons />

        {/* searchbar */}
        <div className="relative max-w-xl w-full mx-auto">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search for songs, artists, or albums..."
              className="w-full bg-white text-black rounded-full pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* User Profile & Logout */}
        <div className="relative shrink-0">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 bg-black bg-opacity-70 hover:bg-opacity-80 rounded-full px-3 py-2 transition"
          >
            {user?.image ? (
              <img 
                src={user.image} 
                alt={user.displayName}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                <User size={20} className="text-gray-400" />
              </div>
            )}
            <span className="text-white text-sm font-semibold max-w-[120px] truncate">
              {user?.displayName || 'User'}
            </span>
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowDropdown(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-neutral-800 rounded-lg shadow-lg overflow-hidden z-50">
                <div className="p-3 border-b border-gray-700">
                  <p className="text-white font-semibold text-sm truncate">
                    {user?.displayName}
                  </p>
                  <p className="text-gray-400 text-xs truncate">
                    {user?.email}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-neutral-700 transition"
                >
                  <LogOut size={18} />
                  <span>Log out</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;