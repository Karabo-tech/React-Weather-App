import React, { useState, useEffect } from 'react';
import { getSavedLocations, removeLocation } from '../utils/storage';
import styles from '../styles/LocationList.module.css';
import type { SavedLocation } from '../types/weather';

interface LocationListProps {
  onLocationSelect: (location: SavedLocation) => void;
}

const LocationList: React.FC<LocationListProps> = ({ onLocationSelect }) => {
  const [locations, setLocations] = useState<SavedLocation[]>(getSavedLocations());

  // Listen for storage changes to update locations in real-time
  useEffect(() => {
    const updateLocations = () => {
      setLocations(getSavedLocations());
    };

    // Listen for custom 'locationsUpdated' event (for same-tab updates)
    window.addEventListener('locationsUpdated', updateLocations);

    // Listen for storage changes from other tabs/windows
    window.addEventListener('storage', updateLocations);

    return () => {
      window.removeEventListener('locationsUpdated', updateLocations);
      window.removeEventListener('storage', updateLocations);
    };
  }, []);

  const handleRemove = (lat: number, lon: number) => {
    removeLocation(lat, lon);
    setLocations(getSavedLocations());
  };

  if (locations.length === 0) {
    return null;
  }

  return (
    <div className={styles.locationList}>
      <h3 className={styles.title}>Saved Locations</h3>
      <div className={styles.locationGrid}>
        {locations.map((loc) => (
          <div key={`${loc.lat}-${loc.lon}`} className={styles.locationCard}>
            <button
              onClick={() => onLocationSelect(loc)}
              className={styles.locationButton}
              title="View weather"
            >
              <span className={styles.locationName}>{loc.name}</span>
              {loc.country && <span className={styles.country}>{loc.country}</span>}
            </button>
            <button
              onClick={() => handleRemove(loc.lat, loc.lon)}
              className={styles.removeButton}
              title="Remove location"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LocationList;