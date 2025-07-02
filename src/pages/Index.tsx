
import React, { useState, useEffect } from 'react';
import { AuthService } from '../services/authService';
import { RecommendationService } from '../services/recommendationService';
import { User, WeatherData, MoodRecommendations } from '../types';
import AuthForm from '../components/AuthForm';
import Header from '../components/Header';
import WeatherCard from '../components/WeatherCard';
import RecommendationsSection from '../components/RecommendationsSection';
import MoodSelector from '../components/MoodSelector';
import AIInsights from '../components/AIInsights';
import { LanguageProvider, useLanguage } from '../contexts/LanguageContext';

const IndexContent = () => {
  const [user, setUser] = useState<User | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [recommendations, setRecommendations] = useState<MoodRecommendations | null>(null);
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [backgroundClass, setBackgroundClass] = useState('sunny-bg');
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setIsLoading(false);
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

  const handleWeatherUpdate = async (weatherData: WeatherData) => {
    setWeather(weatherData);
    
    // Set initial mood based on weather if no mood is selected
    if (!selectedMood) {
      const weatherBasedMood = RecommendationService.getMoodFromWeather(weatherData);
      setSelectedMood(weatherBasedMood);
    }
    
    // Get AI-powered recommendations
    try {
      console.log('Getting AI-powered recommendations for weather update...');
      const newRecommendations = await RecommendationService.getRecommendations(weatherData);
      setRecommendations(newRecommendations);
      console.log('AI recommendations set:', newRecommendations);
    } catch (error) {
      console.error('Failed to get recommendations:', error);
      // Fallback to static recommendations
      const fallbackRecommendations = RecommendationService.getRecommendationsByMood(selectedMood || 'happy');
      setRecommendations(fallbackRecommendations);
    }
  };

  const handleMoodChange = async (mood: string) => {
    setSelectedMood(mood);
    
    if (weather) {
      try {
        console.log('Getting AI recommendations for mood change:', mood);
        const newRecommendations = await RecommendationService.getRecommendations(weather);
        setRecommendations(newRecommendations);
      } catch (error) {
        console.error('Failed to get mood-based recommendations:', error);
        // Fallback to static recommendations
        const fallbackRecommendations = RecommendationService.getRecommendationsByMood(mood);
        setRecommendations(fallbackRecommendations);
      }
    }
  };

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center">
        <div className="glass rounded-xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white/60 mx-auto mb-4"></div>
          <p className="text-white/80">Loading...</p>
        </div>
      </div>
    );
  }

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
          
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setShowAIInsights(false)}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                !showAIInsights 
                  ? 'bg-white/30 text-white border border-white/30' 
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              🎯 Recommendations
            </button>
            <button
              onClick={() => setShowAIInsights(true)}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                showAIInsights 
                  ? 'bg-white/30 text-white border border-white/30' 
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              🤖 AI Insights
            </button>
          </div>
          
          {showAIInsights ? (
            <AIInsights />
          ) : (
            <RecommendationsSection recommendations={recommendations} />
          )}
        </div>
        
        <footer className="mt-12 text-center">
          <p className="text-white/60 text-sm">
            {t('footer.madeWith')} ✨ Powered by AI Intelligence
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
