
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
  const [locationStatus, setLocationStatus] = useState<string>('');

  useEffect(() => {
    loadCurrentLocationWeather();
  }, []);

  const loadCurrentLocationWeather = async () => {
    setLoading(true);
    setError(null);
    setLocationStatus('Getting your location...');
    
    try {
      console.log('Attempting to fetch current location weather...');
      const weatherData = await WeatherService.getWeatherByLocation();
      console.log('Weather data received:', weatherData);
      setWeather(weatherData);
      onWeatherUpdate(weatherData);
      setLocationStatus('Location updated successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => setLocationStatus(''), 3000);
    } catch (error) {
      console.error('Error loading weather:', error);
      setError('Unable to get your location. Showing default weather.');
      setLocationStatus('Using default location');
      
      // Try to get weather for Hyderabad as fallback
      try {
        const fallbackWeather = await WeatherService.getWeatherByCity('Hyderabad');
        setWeather(fallbackWeather);
        onWeatherUpdate(fallbackWeather);
      } catch (fallbackError) {
        console.error('Fallback weather fetch failed:', fallbackError);
        setError('Weather service temporarily unavailable. Please try again later.');
        setLocationStatus('');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="glass rounded-xl p-6 text-center slide-up">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white/60 mx-auto mb-4"></div>
        <p className="text-white/80 mb-2">Fetching real-time weather data...</p>
        <p className="text-white/60 text-sm">{locationStatus}</p>
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
            {locationStatus && (
              <p className="text-green-200/80 text-sm mt-2">{locationStatus}</p>
            )}
            {error && (
              <p className="text-yellow-200/80 text-sm mt-2">{error}</p>
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
              disabled={loading}
              className="w-full mt-4 px-4 py-2 bg-white/20 hover:bg-white/30 disabled:bg-white/10 text-white rounded-lg transition-all duration-300 hover-lift backdrop-blur-sm border border-white/20 disabled:cursor-not-allowed"
            >
              {loading ? '🔄 Refreshing...' : '📍 Refresh Location'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherCard;
