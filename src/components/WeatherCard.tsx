
import React, { useState, useEffect } from 'react';
import { WeatherData } from '../types';
import { WeatherService } from '../services/weatherService';

interface WeatherCardProps {
  onWeatherUpdate: (weather: WeatherData) => void;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ onWeatherUpdate }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [cityInput, setCityInput] = useState('');

  useEffect(() => {
    loadCurrentLocationWeather();
  }, []);

  const loadCurrentLocationWeather = async () => {
    setLoading(true);
    try {
      const weatherData = await WeatherService.getWeatherByLocation();
      setWeather(weatherData);
      onWeatherUpdate(weatherData);
    } catch (error) {
      console.error('Error loading weather:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCityWeather = async () => {
    if (!cityInput.trim()) return;
    
    setLoading(true);
    try {
      const weatherData = await WeatherService.getWeatherByCity(cityInput);
      setWeather(weatherData);
      onWeatherUpdate(weatherData);
      setCityInput('');
    } catch (error) {
      console.error('Error loading city weather:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="glass rounded-xl p-6 text-center slide-up">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-white/80">Loading weather...</p>
      </div>
    );
  }

  return (
    <div className="glass rounded-xl p-6 slide-up hover-glow">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h2 className="text-xl font-semibold text-white mb-2 sm:mb-0">Current Weather</h2>
        <div className="flex space-x-2 w-full sm:w-auto">
          <input
            type="text"
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
            placeholder="Enter city name"
            className="px-3 py-2 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 flex-1 sm:flex-none"
            onKeyPress={(e) => e.key === 'Enter' && loadCityWeather()}
          />
          <button
            onClick={loadCityWeather}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-300 hover-lift whitespace-nowrap"
          >
            Search
          </button>
        </div>
      </div>

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
              className="w-full mt-4 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-300 hover-lift"
            >
              📍 Use My Location
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherCard;
