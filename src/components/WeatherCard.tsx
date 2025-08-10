
import React, { useState, useEffect } from 'react';
import { WeatherService } from '../services/weatherService';
import { WeatherData } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface WeatherCardProps {
  onWeatherUpdate: (weather: WeatherData) => void;
}

const WeatherCard: React.FC<WeatherCardProps> = ({
  onWeatherUpdate
}) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [locationInput, setLocationInput] = useState('');
  const {
    t
  } = useLanguage();

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
      <div className="glass rounded-2xl p-6 text-center slide-up">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
        <p className="text-white font-medium">Loading weather...</p>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-6 slide-up hover-lift">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-orange-400/20 to-blue-400/20 border border-white/20 rounded-lg backdrop-blur-sm">
            ☀️
          </div>
          <span>Weather</span>
        </h2>
      </div>

      {/* Search Input */}
      <div className="flex gap-2 sm:gap-3 mb-6">
        <input 
          type="text" 
          value={locationInput} 
          onChange={e => setLocationInput(e.target.value)} 
          onKeyPress={handleKeyPress} 
          placeholder="Enter Location" 
          className="flex-1 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 backdrop-blur-sm transition-all duration-300" 
        />
        <button 
          onClick={searchWeather} 
          className="px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-orange-400/20 to-blue-400/20 hover:from-orange-400/30 hover:to-blue-400/30 text-white rounded-xl transition-all duration-300 font-medium backdrop-blur-sm border border-white/20 hover:border-white/30 min-w-[60px] sm:min-w-[80px] flex items-center justify-center hover-lift text-sm sm:text-base"
        >
          🔍
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/15 border border-red-400/30 rounded-xl p-3 mb-4 backdrop-blur-sm">
          <p className="text-red-200 text-sm leading-relaxed">{error}</p>
        </div>
      )}

      {/* Weather Display */}
      {weather && (
        <div className="space-y-6">
          {/* Main Weather Info */}
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold text-white mb-2">{weather.location}</h3>
            <div className="flex items-center justify-center gap-4">
              <div className="text-center">
                <p className="text-4xl font-bold text-white mb-1">
                  {Math.round(weather.temperature)}°C
                </p>
                <p className="text-white/75 text-sm">
                  Feels like {Math.round(weather.temperature)}°C
                </p>
              </div>
            </div>
            <p className="text-white/85 capitalize mt-2">{weather.condition}</p>
          </div>
          
          {/* Weather Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-400/15 to-blue-500/10 rounded-xl p-4 backdrop-blur-sm border border-blue-400/20 hover-lift">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">💧</span>
                <p className="text-white/85 text-sm font-medium">Humidity</p>
              </div>
              <p className="text-white font-bold text-lg">{weather.humidity}%</p>
            </div>
            
            <div className="bg-gradient-to-br from-orange-400/15 to-orange-500/10 rounded-xl p-4 backdrop-blur-sm border border-orange-400/20 hover-lift">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">💨</span>
                <p className="text-white/85 text-sm font-medium">Wind Speed</p>
              </div>
              <p className="text-white font-bold text-lg">{weather.windSpeed} km/h</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherCard;
