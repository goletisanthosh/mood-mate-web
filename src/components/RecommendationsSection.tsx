
import React from 'react';
import { MoodRecommendations } from '../types';
import MusicPlayer from './MusicPlayer';
import { ScrollArea } from './ui/scroll-area';
import { useLanguage } from '../contexts/LanguageContext';

interface RecommendationsSectionProps {
  recommendations: MoodRecommendations | null;
}

const RecommendationsSection: React.FC<RecommendationsSectionProps> = ({ recommendations }) => {
  const { t } = useLanguage();
  console.log('RecommendationsSection received:', recommendations);

  if (!recommendations) {
    return (
      <div className="glass rounded-xl p-6 text-center">
        <p className="text-white/80">{t('recommendations.getWeather')}</p>
      </div>
    );
  }

  // Convert MusicRecommendation to Song format for MusicPlayer
  const songs = recommendations.music?.map(music => ({
    title: music.title,
    artist: music.artist,
    url: music.spotify_url || '',
    image: '🎵'
  })) || [];

  return (
    <div className="space-y-6">
      {/* Music Recommendations with Player - First */}
      <div className="glass rounded-xl p-6 slide-up hover-glow">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          🎵 {t('recommendations.music.title')}
        </h3>
        <ScrollArea className="h-auto max-h-96">
          <MusicPlayer songs={songs} />
        </ScrollArea>
      </div>

      {/* Food Recommendations - Second */}
      <div className="glass rounded-xl p-6 slide-up hover-glow">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          🍽️ {t('recommendations.food.title')}
        </h3>
        <ScrollArea className="h-auto max-h-96">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pr-4">
            {recommendations.foods && recommendations.foods.length > 0 ? (
              recommendations.foods.map((food, index) => (
                <div
                  key={index}
                  className="bg-white/15 rounded-lg p-4 hover-lift transition-all duration-300 border border-white/10 text-center"
                >
                  <div className="text-4xl mb-3">{food.image}</div>
                  <h4 className="font-bold text-white mb-2 text-lg">{food.name}</h4>
                  <p className="text-white/80 text-sm mb-3 leading-relaxed">{food.description}</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <span className="inline-block px-2 py-1 bg-white/25 text-white text-xs rounded-full font-medium">
                      {t(`food.${food.type.toLowerCase()}`)}
                    </span>
                    <span className="inline-block px-2 py-1 bg-orange-500/40 text-white text-xs rounded-full font-medium">
                      {t('food.indianCuisine')}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-white/70 py-8">
                <div className="text-4xl mb-2">🍽️</div>
                <p>{t('recommendations.noFood').replace('{mood}', recommendations.mood.toLowerCase())}</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Stays Recommendations - Third */}
      <div className="glass rounded-xl p-6 slide-up hover-glow">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          🏨 {t('recommendations.stays.title')}
        </h3>
        <ScrollArea className="h-auto max-h-96">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pr-4">
            {recommendations.stays && recommendations.stays.length > 0 ? (
              recommendations.stays.map((stay, index) => (
                <div
                  key={index}
                  className="bg-white/15 rounded-lg p-4 hover-lift transition-all duration-300 border border-white/10 text-center"
                >
                  <div className="text-4xl mb-3">{stay.image}</div>
                  <h4 className="font-bold text-white mb-2 text-lg">{stay.name}</h4>
                  <p className="text-white/80 text-sm mb-3 leading-relaxed">{stay.description}</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <span className="inline-block px-2 py-1 bg-white/25 text-white text-xs rounded-full font-medium">
                      {t(`stay.${stay.type.toLowerCase().replace(' ', '')}`)}
                    </span>
                    <span className="inline-block px-2 py-1 bg-blue-500/40 text-white text-xs rounded-full font-medium">
                      {t('stay.indianExperience')}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-white/70 py-8">
                <div className="text-4xl mb-2">🏨</div>
                <p>{t('recommendations.noStays').replace('{mood}', recommendations.mood.toLowerCase())}</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default RecommendationsSection;
