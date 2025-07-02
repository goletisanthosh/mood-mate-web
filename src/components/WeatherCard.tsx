
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
      <div className="glass rounded-xl p-6 text-center fade-in">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white/60 mx-auto mb-4"></div>
        <p className="text-white/80">{t('weather.loading')}</p>
      </div>
    );
  }

  return (
    <div className="glass rounded-xl p-6 slide-up hover-glow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white flex items-center">
          ☀️ {t('weather.title')}
        </h2>
        <button
          onClick={getCurrentLocationWeather}
          className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-300 text-sm"
        >
          🔄 {t('weather.refresh')}
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={locationInput}
          onChange={(e) => setLocationInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={t('weather.searchPlaceholder')}
          className="flex-1 px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
        />
        <button
          onClick={searchWeather}
          className="px-4 py-2 bg-blue-500/30 hover:bg-blue-500/50 text-white rounded-lg transition-all duration-300"
        >
          🔍
        </button>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-3 mb-4">
          <p className="text-red-200 text-sm">{error}</p>
        </div>
      )}

      {weather && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-white">{weather.location}</h3>
              <p className="text-white/80 capitalize">{weather.condition}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-white">{Math.round(weather.temperature)}°C</p>
              <p className="text-white/60 text-sm">
                Feels like {Math.round(weather.temperature)}°C
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-white/60">💧 {t('weather.humidity')}</p>
              <p className="text-white font-medium">{weather.humidity}%</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-white/60">💨 {t('weather.windSpeed')}</p>
              <p className="text-white font-medium">{weather.windSpeed} km/h</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherCard;
