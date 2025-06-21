
import React from 'react';
import { MoodRecommendations } from '../types';

interface RecommendationsSectionProps {
  recommendations: MoodRecommendations | null;
}

const RecommendationsSection: React.FC<RecommendationsSectionProps> = ({ recommendations }) => {
  if (!recommendations) {
    return (
      <div className="glass rounded-xl p-6 text-center">
        <p className="text-white/80">Get weather data to see personalized recommendations!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Mood Display */}
      <div className="glass rounded-xl p-6 text-center slide-up hover-glow">
        <h2 className="text-2xl font-bold text-white mb-2">Your Current Mood</h2>
        <p className="text-xl text-white/90">{recommendations.mood}</p>
      </div>

      {/* Music Recommendations - First */}
      <div className="glass rounded-xl p-6 slide-up hover-glow">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          🎵 Music Recommendations
        </h3>
        <div className="space-y-3">
          {recommendations.music.map((song, index) => (
            <div
              key={index}
              className="bg-white/10 rounded-lg p-4 hover-lift transition-all duration-300 flex items-center space-x-4"
            >
              <div className="text-2xl">🎶</div>
              <div className="flex-1">
                <h4 className="font-semibold text-white">{song.title}</h4>
                <p className="text-white/70">{song.artist}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="inline-block px-2 py-1 bg-white/20 text-white/80 text-xs rounded-full">
                    {song.genre}
                  </span>
                  <span className="text-white/60 text-xs">Perfect for {recommendations.mood.toLowerCase()} mood</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Food Recommendations - Second */}
      <div className="glass rounded-xl p-6 slide-up hover-glow">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          🍽️ Food Recommendations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.foods && recommendations.foods.length > 0 ? (
            recommendations.foods.map((food, index) => (
              <div
                key={index}
                className="bg-white/15 rounded-lg p-6 hover-lift transition-all duration-300 border border-white/10"
              >
                <div className="text-5xl mb-4 text-center">{food.image}</div>
                <h4 className="font-bold text-white mb-3 text-center text-lg">{food.name}</h4>
                <p className="text-white/80 text-sm mb-4 text-center leading-relaxed">{food.description}</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <span className="inline-block px-3 py-1 bg-white/25 text-white text-xs rounded-full font-medium">
                    {food.type}
                  </span>
                  <span className="inline-block px-3 py-1 bg-orange-500/40 text-white text-xs rounded-full font-medium">
                    Mood Perfect
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-white/70">
              No food recommendations available
            </div>
          )}
        </div>
      </div>

      {/* Stays Recommendations - Third */}
      <div className="glass rounded-xl p-6 slide-up hover-glow">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          🏨 Stay Recommendations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.stays && recommendations.stays.length > 0 ? (
            recommendations.stays.map((stay, index) => (
              <div
                key={index}
                className="bg-white/15 rounded-lg p-6 hover-lift transition-all duration-300 border border-white/10"
              >
                <div className="text-5xl mb-4 text-center">{stay.image}</div>
                <h4 className="font-bold text-white mb-3 text-center text-lg">{stay.name}</h4>
                <p className="text-white/80 text-sm mb-4 text-center leading-relaxed">{stay.description}</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <span className="inline-block px-3 py-1 bg-white/25 text-white text-xs rounded-full font-medium">
                    {stay.type}
                  </span>
                  <span className="inline-block px-3 py-1 bg-blue-500/40 text-white text-xs rounded-full font-medium">
                    Weather Perfect
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-white/70">
              No stay recommendations available
            </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default RecommendationsSection;
