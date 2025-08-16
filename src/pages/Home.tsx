import React, { useState, useEffect } from 'react';
import WeatherCard from '../components/WeatherCard';
import SearchBar from '../components/SearchBar';
import LocationList from '../components/LocationList';
import UnitToggle from '../components/UnitToggle';
import Notification from '../components/Notification';
import { fetchCurrentWeather, fetchForecast } from '../utils/api';
import { saveLocation, getCachedWeatherData } from '../utils/storage';
import type { WeatherData, ForecastData, SavedLocation, GeolocationData } from '../types/weather';
import styles from '../styles/Home.module.css';

const Home: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric');
  const [error, setError] = useState('');
  const [view, setView] = useState<'current' | 'hourly' | 'daily'>('current');

  useEffect(() => {
    const fetchUserWeather = async () => {
      try {
        const cached = getCachedWeatherData('current');
        if (cached) {
          setWeather(cached);
          return;
        }
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const { latitude: lat, longitude: lon } = position.coords;
              const weatherData = await fetchCurrentWeather(lat, lon, units);
              const forecastData = await fetchForecast(lat, lon, units);
              setWeather(weatherData);
              setForecast(forecastData);
              saveLocation({ name: weatherData.name, lat, lon });
            } catch (err: any) {
              setError(err.message || 'Failed to fetch weather data');
            }
          },
          () => setError('Location access denied')
        );
      } catch (err: any) {
        setError(err.message || 'Failed to fetch weather data');
      }
    };
    fetchUserWeather();
  }, [units]);

  const handleLocationSelect = async (location: GeolocationData | SavedLocation) => {
    try {
      const cached = getCachedWeatherData(location.name);
      if (cached) {
        setWeather(cached);
        return;
      }
      const weatherData = await fetchCurrentWeather(location.lat, location.lon, units);
      const forecastData = await fetchForecast(location.lat, location.lon, units);
      setWeather(weatherData);
      setForecast(forecastData);
      saveLocation(location);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch weather data for selected location');
    }
  };

  return (
    <div className={styles.container}>
      <SearchBar onLocationSelect={handleLocationSelect} />
      <div className={styles.controls}>
        <UnitToggle units={units} setUnits={setUnits} />
        <div>
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
        <LocationList onLocationSelect={handleLocationSelect} />
      </div>
      {error && <Notification message={error} />}
      {view === 'current' && weather && <WeatherCard weather={weather} units={units} />}
      {view === 'hourly' && forecast && (
        <div className={styles.forecast}>
          <h3>Hourly Forecast</h3>
          {forecast.list.slice(0, 8).map((item, index) => (
            <div key={index}>
              <p>
                {new Date(item.dt * 1000).toLocaleTimeString()}: {item.main.temp.toFixed(1)}°
                {units === 'metric' ? 'C' : 'F'} - {item.weather[0].description}
                <img
                  src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                  alt="Weather icon"
                  style={{ width: '40px', verticalAlign: 'middle', marginLeft: '8px' }}
                />
              </p>
            </div>
          ))}
        </div>
      )}
      {view === 'daily' && forecast && (
        <div className={styles.forecast}>
          <h3>Daily Forecast</h3>
          {forecast.list.filter((_, index) => index % 8 === 0).map((item, index) => (
            <div key={index}>
              <p>
                {new Date(item.dt * 1000).toLocaleDateString()}: {item.main.temp.toFixed(1)}°
                {units === 'metric' ? 'C' : 'F'} - {item.weather[0].description}
                <img
                  src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                  alt="Weather icon"
                  style={{ width: '40px', verticalAlign: 'middle', marginLeft: '8px' }}
                />
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;