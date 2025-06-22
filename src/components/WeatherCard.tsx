
import React, { useState, useEffect } from 'react';
import { WeatherData } from '../types';
import { WeatherService } from '../services/weatherService';

interface WeatherCardProps {
  onWeatherUpdate: (weather: WeatherData) => void;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ onWeatherUpdate }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCurrentLocationWeather();
  }, []);

  const loadCurrentLocationWeather = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Attempting to fetch weather data...');
      const weatherData = await WeatherService.getWeatherByLocation();
      console.log('Weather data received:', weatherData);
      setWeather(weatherData);
      onWeatherUpdate(weatherData);
    } catch (error) {
      console.error('Error loading weather:', error);
      setError('Unable to fetch weather data. Using default location.');
      // Try to get weather for a default location as fallback
      try {
        const fallbackWeather = await WeatherService.getWeatherByCity('London');
        setWeather(fallbackWeather);
        onWeatherUpdate(fallbackWeather);
        setError(null);
      } catch (fallbackError) {
        console.error('Fallback weather fetch failed:', fallbackError);
        setError('Weather service temporarily unavailable. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="glass rounded-xl p-6 text-center slide-up">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white/60 mx-auto mb-4"></div>
        <p className="text-white/80">Fetching real-time weather data...</p>
      </div>
    );
  }

  if (error && !weather) {
    return (
      <div className="glass rounded-xl p-6 text-center slide-up">
        <div className="text-6xl mb-4">🌍</div>
        <p className="text-white/80 mb-4">{error}</p>
        <button
          onClick={loadCurrentLocationWeather}
          className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-300 hover-lift backdrop-blur-sm border border-white/20"
        >
          🔄 Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="glass rounded-xl p-6 slide-up hover-glow">
      <h2 className="text-xl font-semibold text-white mb-4">Real-time Weather</h2>

      {weather && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-center">
            <div className="text-6xl mb-2">
              {weather.condition.includes('sun') || weather.condition.includes('clear') ? '☀️' :
               weather.condition.includes('rain') ? '🌧️' :
               weather.condition.includes('cloud') ? '☁️' :
               weather.condition.includes('snow') ? '❄️' : '🌤️'}
            </div>
            <h3 className="text-2xl font-bold text-white">{weather.temperature}°C</h3>
            <p className="text-white/80 capitalize">{weather.description}</p>
            <p className="text-white/60">{weather.location}</p>
            {error && (
              <p className="text-yellow-200/80 text-sm mt-2">Using default location</p>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-white/80">
              <span>Humidity:</span>
              <span>{weather.humidity}%</span>
            </div>
            <div className="flex justify-between text-white/80">
              <span>Wind Speed:</span>
              <span>{weather.windSpeed} km/h</span>
            </div>
            <button
              onClick={loadCurrentLocationWeather}
              className="w-full mt-4 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-300 hover-lift backdrop-blur-sm border border-white/20"
            >
              📍 Refresh Location
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherCard;
