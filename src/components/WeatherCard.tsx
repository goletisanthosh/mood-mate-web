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
    return <div className="glass rounded-2xl p-4 sm:p-6 text-center slide-up">
        <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-400/60 mx-auto mb-3 sm:mb-4"></div>
        <p className="text-white font-medium text-sm sm:text-base">Loading weather...</p>
      </div>;
  }

  return <div className="glass rounded-2xl p-4 sm:p-6 slide-up hover-glow">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
        <h2 className="text-lg sm:text-2xl font-bold text-white flex items-center gap-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 bg-gradient-to-r from-orange-400/30 to-amber-400/20 border border-orange-400/25 rounded-lg backdrop-blur-sm neon-orange">
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
          onChange={e => setLocationInput(e.target.value)} 
          onKeyPress={handleKeyPress} 
          placeholder="Enter Location" 
          className="flex-1 px-3 py-2.5 sm:px-4 sm:py-3 bg-white/15 border border-white/25 rounded-xl text-white placeholder-white/65 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 backdrop-blur-sm text-sm sm:text-base transition-all duration-300 neon-blue" 
        />
        <button 
          onClick={searchWeather} 
          className="px-4 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-orange-400/25 to-amber-400/20 hover:from-orange-400/35 hover:to-amber-400/30 text-white rounded-xl transition-all duration-300 font-medium backdrop-blur-sm border border-orange-400/25 hover:border-orange-400/40 text-sm sm:text-base min-w-[60px] sm:min-w-[80px] flex items-center justify-center neon-orange hover-lift"
        >
          🔍
        </button>
      </div>

      {/* Error Message */}
      {error && <div className="bg-red-500/15 border border-red-400/25 rounded-xl p-3 mb-4 backdrop-blur-sm">
          <p className="text-red-200 text-xs sm:text-sm leading-relaxed">{error}</p>
        </div>}

      {/* Weather Display */}
      {weather && <div className="space-y-4 sm:space-y-6">
          {/* Main Weather Info */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="flex-1">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-1 text-center">{weather.location}</h3>
              <p className="text-white/85 capitalize text-sm sm:text-base text-center">{weather.condition}</p>
            </div>
            <div className="text-center sm:text-right">
              <p className="text-2xl sm:text-4xl font-bold text-white mb-1">
                {Math.round(weather.temperature)}°C
              </p>
              <p className="text-white/75 text-xs sm:text-sm">
                Feels like {Math.round(weather.temperature)}°C
              </p>
            </div>
          </div>
          
          {/* Weather Details Grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-gradient-to-br from-white/12 to-blue-400/10 rounded-xl p-3 sm:p-4 backdrop-blur-sm border border-blue-400/20 hover-lift neon-blue">
              <div className="flex items-center gap-2 mb-1 sm:mb-2">
                <span className="text-lg sm:text-xl">💧</span>
                <p className="text-white/85 text-xs sm:text-sm font-medium">Humidity</p>
              </div>
              <p className="text-white font-bold text-base sm:text-lg">{weather.humidity}%</p>
            </div>
            
            <div className="bg-gradient-to-br from-white/12 to-orange-400/10 rounded-xl p-3 sm:p-4 backdrop-blur-sm border border-orange-400/20 hover-lift neon-orange">
              <div className="flex items-center gap-2 mb-1 sm:mb-2">
                <span className="text-lg sm:text-xl">💨</span>
                <p className="text-white/85 text-xs sm:text-sm font-medium">Wind Speed</p>
              </div>
              <p className="text-white font-bold text-base sm:text-lg">{weather.windSpeed} km/h</p>
            </div>
          </div>
        </div>}
    </div>;
};

export default WeatherCard;
