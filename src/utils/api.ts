import axios from 'axios';
import type { WeatherData, ForecastData, GeolocationData } from '../types/weather';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

export const fetchCurrentWeather = async (
  lat: number,
  lon: number,
  units: 'metric' | 'imperial'
): Promise<WeatherData> => {
  const response = await axios.get(`${BASE_URL}/weather`, {
    params: { lat, lon, units, appid: API_KEY },
  });
  return response.data;
};

export const fetchForecast = async (
  lat: number,
  lon: number,
  units: 'metric' | 'imperial'
): Promise<ForecastData> => {
  const response = await axios.get(`${BASE_URL}/forecast`, {
    params: { lat, lon, units, appid: API_KEY },
  });
  return response.data;
};

export const searchLocation = async (query: string): Promise<GeolocationData[]> => {
  const response = await axios.get(`${GEO_URL}/direct`, {
    params: { q: query, limit: 5, appid: API_KEY },
  });
  return response.data;
};