import React, { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from './const';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/api/search`, { query });
      onSearch(response.data);
    } catch (error) {
      console.error('Error searching video:', error);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ask a question about the video"
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default SearchBar;
