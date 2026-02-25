import React, { useState, useEffect } from 'react';
import WeatherCard from '../components/WeatherCard';
import SearchBar from '../components/SearchBar';
import LocationList from '../components/LocationList';
import UnitToggle from '../components/UnitToggle';
import Notification from '../components/Notification';
import { fetchCurrentWeather, fetchForecast } from '../utils/api';
import {
  saveLocation,
  getSavedLocations,
  saveWeatherData,
  getSavedWeatherData,
  getAllOfflineWeatherData,
  clearExpiredCache,
} from '../utils/storage';
import type { WeatherData, ForecastData, SavedLocation, GeolocationData } from '../types/weather';
import styles from '../styles/Home.module.css';

const Home: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric');
  const [error, setError] = useState('');
  const [view, setView] = useState<'current' | 'hourly' | 'daily'>('current');
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Auto-detect location on mount
  useEffect(() => {
    const fetchUserWeather = async () => {
      setLoading(true);
      setError('');

      try {
        // Try to get current position
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude: lat, longitude: lon } = position.coords;
            await fetchWeatherData(lat, lon);
          },
          (error) => {
            // If geolocation fails, show notification but try to load cached data
            if (error.code === 1) {
              setError('Location access denied. Showing saved locations.');
            } else {
              setError('Unable to detect location. Showing saved locations.');
            }
            loadOfflineData();
          }
        );
      } catch (err) {
        console.error('Geolocation error:', err);
        loadOfflineData();
      }
    };

    fetchUserWeather();
  }, []);

  // Update units
  useEffect(() => {
    if (weather) {
      refetchWeatherData(weather.coord?.lat, weather.coord?.lon);
    }
  }, [units]);

  const fetchWeatherData = async (lat: number, lon: number) => {
    try {
      setLoading(true);
      setError('');

      // First check cache
      const cached = getSavedWeatherData(lat, lon);
      if (cached && !isOnline) {
        setWeather(cached.weather);
        setForecast(cached.forecast);
        setLoading(false);
        return;
      }

      // Fetch fresh data if online
      if (isOnline) {
        const weatherData = await fetchCurrentWeather(lat, lon, units);
        const forecastData = await fetchForecast(lat, lon, units);

        setWeather(weatherData);
        setForecast(forecastData);

        // Save to cache
        const location: SavedLocation = {
          name: weatherData.name,
          lat,
          lon,
          country: weatherData.sys?.country,
        };
        saveLocation(location);
        saveWeatherData(location, weatherData, forecastData);
        // Notify LocationList component of the update
        window.dispatchEvent(new Event('locationsUpdated'));
      } else {
        // If offline and no cache, show cached data
        if (cached) {
          setWeather(cached.weather);
          setForecast(cached.forecast);
        } else {
          setError('No internet connection and no cached data available.');
        }
      }
    } catch (err: any) {
      console.error('Weather fetch error:', err);
      if (isOnline) {
        setError(err.message || 'Failed to fetch weather data');
      }
      // Try to load cached data as fallback
      const cached = getSavedWeatherData(lat, lon);
      if (cached) {
        setWeather(cached.weather);
        setForecast(cached.forecast);
        if (!error) {
          setError('Showing cached data');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const refetchWeatherData = async (lat?: number, lon?: number) => {
    if (lat !== undefined && lon !== undefined) {
      await fetchWeatherData(lat, lon);
    }
  };

  const loadOfflineData = () => {
    // Try to load the most recent cached weather
    const allWeatherData = getAllOfflineWeatherData();
    if (allWeatherData.length > 0) {
      const mostRecent = allWeatherData.reduce((prev, current) =>
        prev.timestamp > current.timestamp ? prev : current
      );
      setWeather(mostRecent.weather);
      setForecast(mostRecent.forecast);
    }
    setLoading(false);
  };

  const handleLocationSelect = async (location: GeolocationData | SavedLocation) => {
    await fetchWeatherData(location.lat, location.lon);
  };

  return (
    <div className={styles.container}>
      {!isOnline && <Notification message="You are offline. Data may be cached." />}
      {error && error !== 'You are offline. Data may be cached.' && (
        <Notification message={error} />
      )}

      <SearchBar onLocationSelect={handleLocationSelect} />

      <div className={styles.controls}>
        <UnitToggle units={units} setUnits={setUnits} />
        <div className={styles.viewButtons}>
          <button
            className={`${styles.button} ${view === 'current' ? styles.active : ''}`}
            onClick={() => setView('current')}
          >
            Current
          </button>
          <button
            className={`${styles.button} ${view === 'hourly' ? styles.active : ''}`}
            onClick={() => setView('hourly')}
          >
            Hourly
          </button>
          <button
            className={`${styles.button} ${view === 'daily' ? styles.active : ''}`}
            onClick={() => setView('daily')}
          >
            Daily
          </button>
        </div>
      </div>

      {loading && weather === null && (
        <div className={styles.loading}>Loading weather data...</div>
      )}

      {view === 'current' && weather && (
        <WeatherCard weather={weather} forecast={forecast} units={units} />
      )}

      {view === 'hourly' && forecast && (
        <div className={styles.forecast}>
          <h3>Hourly Forecast</h3>
          <div className={styles.forecastGrid}>
            {forecast.list.slice(0, 8).map((item, index) => (
              <div key={index} className={styles.forecastItem}>
                <p className={styles.time}>
                  {new Date(item.dt * 1000).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
                <img
                  src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                  alt="Weather icon"
                  className={styles.forecastIcon}
                />
                <p className={styles.temp}>
                  {Math.round(item.main.temp)}°{units === 'metric' ? 'C' : 'F'}
                </p>
                <p className={styles.description}>{item.weather[0].description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === 'daily' && forecast && (
        <div className={styles.forecast}>
          <h3>Daily Forecast</h3>
          <div className={styles.dailyForecastList}>
            {forecast.list
              .filter((_, index) => index % 8 === 0)
              .map((item, index) => (
                <div key={index} className={styles.dailyForecastItem}>
                  <p className={styles.date}>
                    {new Date(item.dt * 1000).toLocaleDateString([], {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                  <img
                    src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                    alt="Weather icon"
                    className={styles.dailyIcon}
                  />
                  <p className={styles.dailyTemp}>
                    {Math.round(item.main.temp)}°{units === 'metric' ? 'C' : 'F'}
                  </p>
                  <p className={styles.dailyDescription}>{item.weather[0].description}</p>
                </div>
              ))}
          </div>
        </div>
      )}

      <LocationList onLocationSelect={handleLocationSelect} />
    </div>
  );
};

export default Home;