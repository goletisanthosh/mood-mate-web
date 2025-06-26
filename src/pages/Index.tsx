
import React, { useState, useEffect } from 'react';
import { AuthService } from '../services/authService';
import { RecommendationService } from '../services/recommendationService';
import { User, WeatherData, MoodRecommendations } from '../types';
import AuthForm from '../components/AuthForm';
import Header from '../components/Header';
import WeatherCard from '../components/WeatherCard';
import RecommendationsSection from '../components/RecommendationsSection';
import MoodSelector from '../components/MoodSelector';
import { LanguageProvider, useLanguage } from '../contexts/LanguageContext';

const IndexContent = () => {
  const [user, setUser] = useState<User | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [recommendations, setRecommendations] = useState<MoodRecommendations | null>(null);
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [backgroundClass, setBackgroundClass] = useState('sunny-bg');
  const { t } = useLanguage();

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
    setSelectedMood('');
  };

  const handleWeatherUpdate = (weatherData: WeatherData) => {
    setWeather(weatherData);
    
    // Set initial mood based on weather if no mood is selected
    if (!selectedMood) {
      const weatherBasedMood = RecommendationService.getMoodFromWeather(weatherData);
      setSelectedMood(weatherBasedMood);
    }
    
    // Update recommendations based on selected mood or weather-based mood
    const moodToUse = selectedMood || RecommendationService.getMoodFromWeather(weatherData);
    const newRecommendations = RecommendationService.getRecommendationsByMood(moodToUse);
    setRecommendations(newRecommendations);
  };

  const handleMoodChange = (mood: string) => {
    setSelectedMood(mood);
    const newRecommendations = RecommendationService.getRecommendationsByMood(mood);
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
          
          {weather && (
            <MoodSelector 
              selectedMood={selectedMood} 
              onMoodChange={handleMoodChange}
            />
          )}
          
          <RecommendationsSection recommendations={recommendations} />
        </div>
        
        <footer className="mt-12 text-center">
          <p className="text-white/60 text-sm">
            {t('footer.madeWith')}
          </p>
        </footer>
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <LanguageProvider>
      <IndexContent />
    </LanguageProvider>
  );
};

export default Index;
