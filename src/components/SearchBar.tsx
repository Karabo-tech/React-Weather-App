import React, { useState } from 'react';
import { searchLocation } from '../utils/api';
import styles from '../styles/SearchBar.module.css';
import type { GeolocationData } from '../types/weather';

interface SearchBarProps {
  onLocationSelect: (location: GeolocationData) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onLocationSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeolocationData[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    try {
      const searchResults = await searchLocation(query);
      if (searchResults.length > 0) {
        setResults(searchResults);
      } else {
        setError('No locations found');
        setResults([]);
      }
    } catch (err) {
      setError('Failed to search location');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectLocation = (location: GeolocationData) => {
    onLocationSelect(location);
    setQuery('');
    setResults([]);
    setError('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className={styles.searchBar}>
      <div className={styles.searchContainer}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Search for a city..."
          className={styles.input}
        />
        <button onClick={handleSearch} className={styles.button} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>
      
      {error && <p className={styles.error}>{error}</p>}
      
      {results.length > 0 && (
        <div className={styles.resultsList}>
          {results.map((result, index) => (
            <button
              key={index}
              className={styles.resultItem}
              onClick={() => handleSelectLocation(result)}
            >
              <span className={styles.locationName}>{result.name}</span>
              {result.country && <span className={styles.country}>{result.country}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;