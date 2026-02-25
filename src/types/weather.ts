export interface WeatherData {
  main: { temp: number; humidity: number; feels_like: number };
  wind: { speed: number };
  weather: { description: string; icon: string }[];
  name: string;
  coord?: { lat: number; lon: number };
  sys?: { country: string };
}

export interface ForecastData {
  list: {
    dt: number;
    main: { temp: number };
    weather: { description: string; icon: string }[];
  }[];
}

export interface SavedLocation {
  name: string;
  lat: number;
  lon: number;
  country?: string;
  savedAt?: number;
}

export interface SavedWeatherData {
  location: SavedLocation;
  weather: WeatherData;
  forecast: ForecastData;
  timestamp: number;
}

export interface GeolocationData {
  name: string;
  lat: number;
  lon: number;
  country: string;
}