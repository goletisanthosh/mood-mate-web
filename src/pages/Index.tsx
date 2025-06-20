
import React, { useState, useEffect } from 'react';
import { AuthService } from '../services/authService';
import { RecommendationService } from '../services/recommendationService';
import { User, WeatherData, MoodRecommendations } from '../types';
import AuthForm from '../components/AuthForm';
import Header from '../components/Header';
import WeatherCard from '../components/WeatherCard';
import RecommendationsSection from '../components/RecommendationsSection';

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [recommendations, setRecommendations] = useState<MoodRecommendations | null>(null);
  const [backgroundClass, setBackgroundClass] = useState('sunny-bg');

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  useEffect(() => {
    // Update background based on weather
    if (weather) {
      const condition = weather.condition.toLowerCase();
      const currentHour = new Date().getHours();
      const isNight = currentHour < 6 || currentHour > 19;
      
      if (isNight) {
        if (condition.includes('clear')) {
          setBackgroundClass('clear-night-bg');
        } else {
          setBackgroundClass('night-bg');
        }
      } else if (condition.includes('sun') || condition.includes('clear')) {
        setBackgroundClass('sunny-bg');
      } else if (condition.includes('rain') || condition.includes('storm')) {
        setBackgroundClass('rainy-bg');
      } else if (condition.includes('snow')) {
        setBackgroundClass('snowy-bg');
      } else if (condition.includes('cloud')) {
        setBackgroundClass('cloudy-bg');
      } else {
        setBackgroundClass('sunny-bg');
      }
    }
  }, [weather]);

  const handleAuthSuccess = (authenticatedUser: User) => {
    setUser(authenticatedUser);
  };

  const handleLogout = () => {
    setUser(null);
    setWeather(null);
    setRecommendations(null);
  };

  const handleWeatherUpdate = (weatherData: WeatherData) => {
    setWeather(weatherData);
    const newRecommendations = RecommendationService.getRecommendations(weatherData);
    setRecommendations(newRecommendations);
  };

  if (!user) {
    return (
      <div className={`min-h-screen transition-all duration-1000 ${backgroundClass}`}>
        <AuthForm onAuthSuccess={handleAuthSuccess} />
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-all duration-1000 ${backgroundClass}`}>
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <Header user={user} onLogout={handleLogout} />
        
        <div className="space-y-6">
          <WeatherCard onWeatherUpdate={handleWeatherUpdate} />
          <RecommendationsSection recommendations={recommendations} />
        </div>
        
        <footer className="mt-12 text-center">
          <p className="text-white/60 text-sm">
            Made with ❤️ by Mood Mate • Weather-powered recommendations
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
