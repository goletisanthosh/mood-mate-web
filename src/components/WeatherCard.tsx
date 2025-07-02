
import React, { useState, useEffect } from 'react';
import { WeatherService } from '../services/weatherService';
import { WeatherData } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface WeatherCardProps {
  onWeatherUpdate: (weather: WeatherData) => void;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ onWeatherUpdate }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [locationInput, setLocationInput] = useState('');
  const { t } = useLanguage();

  useEffect(() => {
    getCurrentLocationWeather();
  }, []);

  const getCurrentLocationWeather = async () => {
    setLoading(true);
    setError('');
    try {
      const weatherData = await WeatherService.getWeatherByLocation();
      setWeather(weatherData);
      onWeatherUpdate(weatherData);
    } catch (err) {
      console.error('Weather fetch error:', err);
      setError('Unable to get current location weather. Please try entering a city name.');
    } finally {
      setLoading(false);
    }
  };

  const searchWeather = async () => {
    if (!locationInput.trim()) return;
    
    setLoading(true);
    setError('');
    try {
      const weatherData = await WeatherService.getWeatherByCity(locationInput.trim());
      setWeather(weatherData);
      onWeatherUpdate(weatherData);
    } catch (err) {
      console.error('Weather search error:', err);
      setError('Unable to find weather for this location. Please try a different city.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchWeather();
    }
  };

  if (loading) {
    return (
      <div className="bg-white/20 backdrop-blur-md border border-white/30 shadow-xl rounded-xl p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-800 font-medium">Loading weather...</p>
      </div>
    );
  }

  return (
    <div className="bg-white/20 backdrop-blur-md border border-white/30 shadow-xl rounded-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          ☀️ Weather
        </h2>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={locationInput}
          onChange={(e) => setLocationInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter Location"
          className="flex-1 px-4 py-2 bg-white/30 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          onClick={searchWeather}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-300 font-medium"
        >
          🔍
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 rounded-lg p-3 mb-4">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {weather && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">{weather.location}</h3>
              <p className="text-gray-600 capitalize">{weather.condition}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-gray-800">{Math.round(weather.temperature)}°C</p>
              <p className="text-gray-600 text-sm">
                Feels like {Math.round(weather.temperature)}°C
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-white/20 rounded-lg p-3">
              <p className="text-gray-600">💧 Humidity</p>
              <p className="text-gray-800 font-medium">{weather.humidity}%</p>
            </div>
            <div className="bg-white/20 rounded-lg p-3">
              <p className="text-gray-600">💨 Wind Speed</p>
              <p className="text-gray-800 font-medium">{weather.windSpeed} km/h</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherCard;
