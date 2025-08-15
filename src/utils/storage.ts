import type { SavedLocation, WeatherData } from '../types/weather';

// Save a new location
export const saveLocation = (location: SavedLocation): void => {
  const locations = getSavedLocations();
  if (!locations.find((loc) => loc.name === location.name)) {
    localStorage.setItem('locations', JSON.stringify([...locations, location]));
  }
};

// Retrieve all saved locations
export const getSavedLocations = (): SavedLocation[] => {
  const data = localStorage.getItem('locations');
  return data ? JSON.parse(data) : [];
};

// Remove a location
export const removeLocation = (name: string): void => {
  const locations = getSavedLocations().filter((loc) => loc.name !== name);
  localStorage.setItem('locations', JSON.stringify(locations));
};

// Cache weather data with timestamp
export const cacheWeatherData = (location: string, data: WeatherData): void => {
  localStorage.setItem(`weather_${location}`, JSON.stringify({ data, timestamp: Date.now() }));
};

// Retrieve cached weather data if not expired (1 hour)
export const getCachedWeatherData = (location: string): WeatherData | null => {
  const data = localStorage.getItem(`weather_${location}`);
  if (data) {
    const parsed = JSON.parse(data);
    if (Date.now() - parsed.timestamp < 3600000) {
      return parsed.data;
    }
  }
  return null;
};