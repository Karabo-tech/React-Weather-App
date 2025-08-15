import React, { useState } from 'react';
import { searchLocation } from '../utils/api';
import styles from '../styles/SearchBar.module.css';
import type { GeolocationData } from '../types/weather';

interface SearchBarProps {
  onLocationSelect: (location: GeolocationData) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onLocationSelect }) => {
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!query) return;
    try {
      const results = await searchLocation(query);
      if (results.length > 0) {
        onLocationSelect(results[0]);
        setQuery('');
        setError('');
      } else {
        setError('No locations found');
      }
    } catch (err) {
      setError('Failed to search location');
    }
  };

  return (
    <div className={styles.searchBar}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a city..."
        className={styles.input}
      />
      <button onClick={handleSearch} className={styles.button}>
        Search
      </button>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export default SearchBar;