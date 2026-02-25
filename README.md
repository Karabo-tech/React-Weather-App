# React Weather App

A modern, responsive weather application built with React, TypeScript, and Vite, designed to provide real-time weather data, location-based forecasting, and a user-friendly interface. The app features a clean, weather-inspired design with a cloud background, semi-transparent cards, and smooth animations, resembling professional weather apps like AccuWeather or Weather Underground.

## Features

- **Real-Time Weather Data**: Displays current temperature, humidity, wind speed, and weather conditions using the OpenWeatherMap API.
- **Location-Based Forecasting**: Fetches weather for the user’s current location (with permission) or allows searching for any city (e.g., Pretoria).
- **Hourly and Daily Forecasts**: Toggle between current weather, hourly (8-hour), and daily (5-day) forecasts.
- **Units Toggle**: Switch between Celsius and Fahrenheit for temperature and wind speed.
- **Saved Locations**: Persist favorite locations in localStorage for quick access.
- **Offline Access**: Displays cached weather data when offline, ensuring usability without internet.
- **Responsive Design**: Optimized for mobile, tablet, and desktop (breakpoints: 320px, 480px, 768px, 1024px, 1200px).
- **Modern UI**: Features a cloud-themed background (`clouds.webp`), semi-transparent cards, weather-blue accents, hover effects, and smooth transitions.
- **Error Handling**: Shows user-friendly notifications for errors (e.g., location access denied, invalid API key).

## Tech Stack

- **Frontend**: React, TypeScript
- **Build Tool**: Vite
- **Styling**: CSS Modules with weather-inspired colors and animations
- **API**: OpenWeatherMap API for weather and geolocation data
- **HTTP Client**: Axios
- **Deployment**: Vercel
- **Storage**: localStorage for caching locations and weather data

## Prerequisites

- Node.js (v16 or later)
- OpenWeatherMap API key
- Git
- Vercel for deployment

## Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/react-weather-app.git
   cd react-weather-app
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   - Create a `.env.local` file in the project root:
     ```
     VITE_OPENWEATHER_API_KEY=your_api_key_here
     ```
   - Replace `your_api_key_here` with your OpenWeatherMap API key (get it [here](https://openweathermap.org/api))

## Running the App

### Development Server
Start the development server with hot module replacement (HMR):
```bash
npm run dev
```
The app will be available at `http://localhost:5173` (or another port if 5173 is in use).

### Production Build
Build the app for production:
```bash
npm run build
```
This will create an optimized build in the `dist/` folder.

### Preview Production Build
Preview the production build locally:
```bash
npm run preview OR npm run dev
```

### Linting
Check code quality with ESLint:
```bash
npm run lint
```

## Live Demo
Visit the deployed app: [https://react-weather-app-zeta.vercel.app/](https://react-weather-app-zeta.vercel.app/)