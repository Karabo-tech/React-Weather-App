import type { SavedLocation, WeatherData, SavedWeatherData, ForecastData } from '../types/weather';

// Save a new location with metadata
export const saveLocation = (location: SavedLocation): void => {
  const locations = getSavedLocations();
  const existingIndex = locations.findIndex(
    (loc) => loc.lat === location.lat && loc.lon === location.lon
  );
  
  const locationWithTimestamp = {
    ...location,
    savedAt: existingIndex === -1 ? Date.now() : locations[existingIndex].savedAt,
  };
  
  if (existingIndex === -1) {
    localStorage.setItem('locations', JSON.stringify([...locations, locationWithTimestamp]));
  } else {
    locations[existingIndex] = locationWithTimestamp;
    localStorage.setItem('locations', JSON.stringify(locations));
  }
};

// Retrieve all saved locations
export const getSavedLocations = (): SavedLocation[] => {
  const data = localStorage.getItem('locations');
  return data ? JSON.parse(data) : [];
};

// Remove a location
export const removeLocation = (lat: number, lon: number): void => {
  const locations = getSavedLocations().filter(
    (loc) => !(loc.lat === lat && loc.lon === lon)
  );
  localStorage.setItem('locations', JSON.stringify(locations));
};

// Save weather data with location
export const saveWeatherData = (location: SavedLocation, weather: WeatherData, forecast: ForecastData): void => {
  const key = `weather_${location.lat}_${location.lon}`;
  const data: SavedWeatherData = {
    location,
    weather,
    forecast,
    timestamp: Date.now(),
  };
  localStorage.setItem(key, JSON.stringify(data));
};

// Get saved weather data if not expired (2 hours)
export const getSavedWeatherData = (lat: number, lon: number): SavedWeatherData | null => {
  const key = `weather_${lat}_${lon}`;
  const data = localStorage.getItem(key);
  if (data) {
    try {
      const parsed = JSON.parse(data) as SavedWeatherData;
      const twoHours = 2 * 60 * 60 * 1000;
      if (Date.now() - parsed.timestamp < twoHours) {
        return parsed;
      }
    } catch {
      return null;
    }
  }
  return null;
};

// Cache weather data with timestamp (for quick access)
export const cacheWeatherData = (location: string, data: WeatherData): void => {
  localStorage.setItem(`weather_${location}`, JSON.stringify({ data, timestamp: Date.now() }));
};

// Retrieve cached weather data if not expired (1 hour)
export const getCachedWeatherData = (location: string): WeatherData | null => {
  const data = localStorage.getItem(`weather_${location}`);
  if (data) {
    try {
      const parsed = JSON.parse(data);
      if (Date.now() - parsed.timestamp < 3600000) {
        return parsed.data;
      }
    } catch {
      return null;
    }
  }
  return null;
};

// Get all offline available weather
export const getAllOfflineWeatherData = (): SavedWeatherData[] => {
  const weatherDataList: SavedWeatherData[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('weather_') && key.includes('_')) {
      try {
        const data = localStorage.getItem(key);
        if (data) {
          const parsed = JSON.parse(data) as SavedWeatherData;
          if (parsed.location && parsed.weather && parsed.forecast) {
            weatherDataList.push(parsed);
          }
        }
      } catch {
        // Skip invalid entries
      }
    }
  }
  return weatherDataList;
};

// Clear expired cache
export const clearExpiredCache = (): void => {
  const twoHours = 2 * 60 * 60 * 1000;
  for (let i = localStorage.length - 1; i >= 0; i--) {
    const key = localStorage.key(i);
    if (key && key.startsWith('weather_')) {
      try {
        const data = localStorage.getItem(key);
        if (data) {
          const parsed = JSON.parse(data);
          if (parsed.timestamp && Date.now() - parsed.timestamp >= twoHours) {
            localStorage.removeItem(key);
          }
        }
      } catch {
        // Skip invalid entries
      }
    }
  }
};