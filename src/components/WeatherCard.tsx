import React, { useState } from 'react';
import { saveLocation, saveWeatherData } from '../utils/storage';
import type { WeatherData, ForecastData } from '../types/weather';
import styles from '../styles/WeatherCard.module.css';

interface WeatherCardProps {
  weather: WeatherData;
  forecast?: ForecastData;
  units: 'metric' | 'imperial';
}

const WeatherCard: React.FC<WeatherCardProps> = ({ weather, forecast, units }) => {
  const [saved, setSaved] = useState(false);

  const handleSaveWeather = () => {
    const location = {
      name: weather.name,
      lat: weather.coord?.lat || 0,
      lon: weather.coord?.lon || 0,
      country: weather.sys?.country,
    };
    saveLocation(location);
    if (forecast) {
      saveWeatherData(location, weather, forecast);
    }
    // Notify LocationList component of the update
    window.dispatchEvent(new Event('locationsUpdated'));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const temp = Math.round(weather.main.temp);
  const feelsLike = Math.round(weather.main.feels_like);
  const description = weather.weather[0]?.description || 'No data';
  const icon = weather.weather[0]?.icon || '04d';
  const windUnit = units === 'metric' ? 'm/s' : 'mph';

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.location}>{weather.name}</h2>
          {weather.sys?.country && <p className={styles.country}>{weather.sys.country}</p>}
        </div>
        <button
          className={`${styles.saveButton} ${saved ? styles.saved : ''}`}
          onClick={handleSaveWeather}
          title={saved ? 'Saved!' : 'Save this location'}
        >
          {saved ? '★' : '☆'}
        </button>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.tempSection}>
          <img
            src={`https://openweathermap.org/img/wn/${icon}@4x.png`}
            alt="Weather icon"
            className={styles.icon}
          />
          <div className={styles.tempInfo}>
            <div className={styles.temperature}>{temp}°</div>
            <p className={styles.unit}>{units === 'metric' ? 'C' : 'F'}</p>
          </div>
        </div>

        <div className={styles.description}>
          <p className={styles.weather}>{description}</p>
          <p className={styles.feelsLike}>Feels like {feelsLike}°{units === 'metric' ? 'C' : 'F'}</p>
        </div>
      </div>

      <div className={styles.detailsGrid}>
        <div className={styles.detailCard}>
          <p className={styles.detailLabel}>Humidity</p>
          <p className={styles.detailValue}>{weather.main.humidity}%</p>
        </div>
        <div className={styles.detailCard}>
          <p className={styles.detailLabel}>Wind Speed</p>
          <p className={styles.detailValue}>{weather.wind.speed.toFixed(1)} {windUnit}</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;