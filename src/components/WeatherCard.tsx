
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
      <div className="glass rounded-2xl p-4 sm:p-6 text-center slide-up">
        <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-orange-500 mx-auto mb-3 sm:mb-4"></div>
        <p className="text-white font-medium text-sm sm:text-base">Loading weather...</p>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-4 sm:p-6 slide-up hover-glow border border-white/20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
        <h2 className="text-lg sm:text-2xl font-bold text-white flex items-center gap-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 bg-orange-500/30 border border-orange-400/30 rounded-lg backdrop-blur-sm">
            ☀️
          </div>
          <span>Weather</span>
        </h2>
      </div>

      {/* Search Input */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4 sm:mb-6">
        <input
          type="text"
          value={locationInput}
          onChange={(e) => setLocationInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter Location"
          className="flex-1 px-3 py-2.5 sm:px-4 sm:py-3 bg-white/20 border border-blue-400/30 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-400/50 backdrop-blur-sm text-sm sm:text-base transition-all duration-300"
        />
        <button
          onClick={searchWeather}
          className="px-4 py-2.5 sm:px-6 sm:py-3 bg-orange-500/30 hover:bg-orange-500/50 text-white rounded-xl transition-all duration-300 font-medium backdrop-blur-sm border border-orange-400/30 hover:border-orange-400/50 text-sm sm:text-base min-w-[60px] sm:min-w-[80px] flex items-center justify-center"
        >
          🔍
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/20 border border-red-400/30 rounded-xl p-3 mb-4 backdrop-blur-sm">
          <p className="text-red-200 text-xs sm:text-sm leading-relaxed">{error}</p>
        </div>
      )}

      {/* Weather Display */}
      {weather && (
        <div className="space-y-4 sm:space-y-6">
          {/* Main Weather Info */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 bg-white/10 rounded-xl p-4 border border-white/20">
            <div className="flex-1">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-1">{weather.location}</h3>
              <p className="text-white/90 capitalize text-sm sm:text-base font-medium">{weather.condition}</p>
            </div>
            <div className="text-center sm:text-right">
              <p className="text-3xl sm:text-4xl font-bold text-orange-400 mb-1">
                {Math.round(weather.temperature)}°C
              </p>
              <p className="text-white/80 text-xs sm:text-sm">
                Feels like {Math.round(weather.temperature)}°C
              </p>
            </div>
          </div>
          
          {/* Weather Details Grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-blue-500/20 border border-blue-400/30 rounded-xl p-3 sm:p-4 backdrop-blur-sm hover-lift transition-all duration-300">
              <div className="flex items-center gap-2 mb-1 sm:mb-2">
                <span className="text-lg sm:text-xl">💧</span>
                <p className="text-white/90 text-xs sm:text-sm font-medium">Humidity</p>
              </div>
              <p className="text-white font-bold text-base sm:text-lg">{weather.humidity}%</p>
            </div>
            
            <div className="bg-orange-500/20 border border-orange-400/30 rounded-xl p-3 sm:p-4 backdrop-blur-sm hover-lift transition-all duration-300">
              <div className="flex items-center gap-2 mb-1 sm:mb-2">
                <span className="text-lg sm:text-xl">💨</span>
                <p className="text-white/90 text-xs sm:text-sm font-medium">Wind Speed</p>
              </div>
              <p className="text-white font-bold text-base sm:text-lg">{weather.windSpeed} km/h</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherCard;
