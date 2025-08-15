import React from 'react';
import { getSavedLocations, removeLocation } from '../utils/storage';
import styles from '../styles/LocationList.module.css';
import type { SavedLocation } from '../types/weather';

interface LocationListProps {
  onLocationSelect: (location: SavedLocation) => void;
}

const LocationList: React.FC<LocationListProps> = ({ onLocationSelect }) => {
  const locations = getSavedLocations();

  const handleRemove = (name: string) => {
    removeLocation(name);
    window.location.reload(); // Refresh to update list
  };

  return (
    <div className={styles.locationList}>
      <h3>Saved Locations</h3>
      {locations.length === 0 ? (
        <p>No saved locations</p>
      ) : (
        <ul>
          {locations.map((loc) => (
            <li key={loc.name} className={styles.locationItem}>
              <span onClick={() => onLocationSelect(loc)} className={styles.locationName}>
                {loc.name}
              </span>
              <button onClick={() => handleRemove(loc.name)} className={styles.removeButton}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocationList;