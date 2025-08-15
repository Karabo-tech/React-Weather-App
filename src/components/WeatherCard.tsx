import React from 'react';
import type { WeatherData } from '../types/weather';
import styles from '../styles/WeatherCard.module.css';

interface WeatherCardProps {
  weather: WeatherData;
  units: 'metric' | 'imperial';
}

const WeatherCard: React.FC<WeatherCardProps> = ({ weather, units }) => {
  return (
    <div className={styles.card}>
      <h2>{weather.name}</h2>
      <img
        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
        alt="Weather icon"
      />
      <p>Temperature: {weather.main.temp.toFixed(1)}°{units === 'metric' ? 'C' : 'F'}</p>
      <p>Feels Like: {weather.main.feels_like.toFixed(1)}°{units === 'metric' ? 'C' : 'F'}</p>
      <p>Humidity: {weather.main.humidity}%</p>
      <p>Wind Speed: {weather.wind.speed} {units === 'metric' ? 'm/s' : 'mph'}</p>
      <p>{weather.weather[0].description}</p>
    </div>
  );
};

export default WeatherCard;