import React, { useState, useEffect } from 'react';
import { AuthService } from '../services/authService';
import { RecommendationService } from '../services/recommendationService';
import { User, WeatherData, MoodRecommendations, LocationData } from '../types';
import AuthForm from '../components/AuthForm';
import Header from '../components/Header';
import WeatherCard from '../components/WeatherCard';
import RecommendationsSection from '../components/RecommendationsSection';
import MoodSelector from '../components/MoodSelector';
import AIInsights from '../components/AIInsights';
import PlacesSection from '../components/PlacesSection';
import { LanguageProvider, useLanguage } from '../contexts/LanguageContext';
import { useLocationPlaces } from '../hooks/useLocationPlaces';
import { Hotel, UtensilsCrossed } from 'lucide-react';

const IndexContent = () => {
  const [user, setUser] = useState<User | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [recommendations, setRecommendations] = useState<MoodRecommendations | null>(null);
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [backgroundClass, setBackgroundClass] = useState('sunny-bg');
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const { t } = useLanguage();

  // Get real-time places data based on location
  const { hotels, restaurants, loading: placesLoading, error: placesError, refetch } = useLocationPlaces(currentLocation);

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Enhanced background logic based on weather and Indian time zones
    if (weather) {
      const condition = weather.condition.toLowerCase();
      
      // Get current time in Indian timezone (IST)
      const now = new Date();
      const istTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
      const currentHour = istTime.getHours();
      
      // Indian timing: Day (7am-6pm), Evening (6pm-8pm), Night (8pm-7am)
      const isDay = currentHour >= 7 && currentHour < 18; // 7am to 6pm
      const isEvening = currentHour >= 18 && currentHour < 20; // 6pm to 8pm
      const isNight = currentHour >= 20 || currentHour < 7; // 8pm to 7am
      const isMorning = currentHour >= 7 && currentHour < 12; // 7am to 12pm
      const isAfternoon = currentHour >= 12 && currentHour < 18; // 12pm to 6pm
      
      if (isNight) {
        if (condition.includes('clear')) {
          setBackgroundClass('clear-night-bg');
        } else {
          setBackgroundClass('night-bg');
        }
      } else if (condition.includes('sun') || condition.includes('clear')) {
        if (isMorning) {
          setBackgroundClass('sunny-morning-bg'); // More vibrant morning colors
        } else if (isAfternoon) {
          setBackgroundClass('sunny-afternoon-bg'); // Bright afternoon colors
        } else if (isEvening) {
          setBackgroundClass('sunny-evening-bg');
        } else {
          setBackgroundClass('sunny-afternoon-bg');
        }
      } else if (condition.includes('rain') || condition.includes('storm')) {
        if (isDay) {
          setBackgroundClass('rainy-morning-bg'); // Brighter rainy day colors
        } else if (isEvening) {
          setBackgroundClass('rainy-evening-bg');
        } else {
          setBackgroundClass('rainy-evening-bg');
        }
      } else if (condition.includes('snow')) {
        setBackgroundClass('snowy-bg');
      } else if (condition.includes('cloud')) {
        if (isDay) {
          setBackgroundClass('cloudy-morning-bg'); // Brighter cloudy day colors
        } else if (isEvening) {
          setBackgroundClass('cloudy-evening-bg');
        } else {
          setBackgroundClass('cloudy-evening-bg');
        }
      } else {
        // Default to bright morning colors during day
        if (isDay) {
          setBackgroundClass('sunny-morning-bg');
        } else {
          setBackgroundClass('night-bg');
        }
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
    
    // Extract coordinates from weather location for places API
    // Note: You might need to geocode the location name to get coordinates
    // For now, we'll use a placeholder - you should implement proper geocoding
    const extractLocationCoordinates = async (locationName: string): Promise<LocationData | null> => {
      // This is a simplified example - you should implement proper geocoding
      // Using a service like Google Geocoding API
      try {
        // For demonstration, using some hardcoded coordinates
        // In real implementation, geocode the location name
        const response = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(locationName)}&limit=1&appid=716e02c95b29ff76212e39800512e9fa`
        );
        const data = await response.json();
        
        if (data.length > 0) {
          return {
            latitude: data[0].lat,
            longitude: data[0].lon
          };
        }
      } catch (error) {
        console.error('Failed to geocode location:', error);
      }
      return null;
    };
    
    // Set location for places API
    const coords = await extractLocationCoordinates(weatherData.location);
    if (coords) {
      setCurrentLocation(coords);
    }
    
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
        const newRecommendations = await RecommendationService.getRecommendationsByWeatherAndMood(weather, mood);
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
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-4xl">
        <Header user={user} onLogout={handleLogout} />
        
        <div className="space-y-4 sm:space-y-6">
          <WeatherCard onWeatherUpdate={handleWeatherUpdate} />
          
          {weather && (
            <MoodSelector 
              selectedMood={selectedMood} 
              onMoodChange={handleMoodChange}
            />
          )}
          
          <div className="flex gap-2 sm:gap-4 mb-4 sm:mb-6">
            <button
              onClick={() => setShowAIInsights(false)}
              className={`px-3 sm:px-4 py-2 rounded-lg transition-all duration-300 text-sm sm:text-base ${
                !showAIInsights 
                  ? 'bg-white/30 text-white border border-white/30' 
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              🎯 Recommendations
            </button>
            <button
              onClick={() => setShowAIInsights(true)}
              className={`px-3 sm:px-4 py-2 rounded-lg transition-all duration-300 text-sm sm:text-base ${
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

          {/* Real-time Places Section */}
          {currentLocation && (
            <div className="grid gap-4 sm:gap-6">
              <PlacesSection
                title="Nearby Hotels & Stays"
                places={hotels}
                loading={placesLoading}
                error={placesError}
                icon={<Hotel className="w-6 h-6 text-blue-300" />}
              />
              
              <PlacesSection
                title="Food & Restaurants"
                places={restaurants}
                loading={placesLoading}
                error={placesError}
                icon={<UtensilsCrossed className="w-6 h-6 text-orange-300" />}
              />
            </div>
          )}
        </div>
        
        <footer className="mt-8 sm:mt-12 text-center">
          <p className="text-white/60 text-xs sm:text-sm">
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
