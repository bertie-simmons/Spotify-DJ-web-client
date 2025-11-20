import React, { useState } from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSearch(query);
    }
  };
  
return (
  <div className="fixed top-0 left-0 w-full bg-neutral-900 p-4 z-50 shadow-lg">
    <div className="max-w-md mx-auto">
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
  </div>
);

};

export default SearchBar;