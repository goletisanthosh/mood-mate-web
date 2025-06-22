
import React from 'react';
import { MoodRecommendations } from '../types';
import MusicPlayer from './MusicPlayer';

interface RecommendationsSectionProps {
  recommendations: MoodRecommendations | null;
}

const RecommendationsSection: React.FC<RecommendationsSectionProps> = ({ recommendations }) => {
  console.log('RecommendationsSection received:', recommendations);

  if (!recommendations) {
    return (
      <div className="glass rounded-xl p-6 text-center">
        <p className="text-white/80">Get weather data to see personalized recommendations!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Music Recommendations with Player - First */}
      <div className="glass rounded-xl p-6 slide-up hover-glow">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          🎵 Telugu Music Recommendations
        </h3>
        <MusicPlayer songs={recommendations.music} />
      </div>

      {/* Food Recommendations - Second */}
      <div className="glass rounded-xl p-6 slide-up hover-glow">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          🍽️ Indian Food Recommendations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                    {food.type}
                  </span>
                  <span className="inline-block px-2 py-1 bg-orange-500/40 text-white text-xs rounded-full font-medium">
                    Indian Cuisine
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-white/70 py-8">
              <div className="text-4xl mb-2">🍽️</div>
              <p>No food recommendations available for {recommendations.mood.toLowerCase()} mood</p>
            </div>
          )}
        </div>
      </div>

      {/* Stays Recommendations - Third */}
      <div className="glass rounded-xl p-6 slide-up hover-glow">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          🏨 Indian Stay Recommendations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                    {stay.type}
                  </span>
                  <span className="inline-block px-2 py-1 bg-blue-500/40 text-white text-xs rounded-full font-medium">
                    Indian Experience
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-white/70 py-8">
              <div className="text-4xl mb-2">🏨</div>
              <p>No stay recommendations available for {recommendations.mood.toLowerCase()} mood</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecommendationsSection;
