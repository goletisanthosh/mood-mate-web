
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendations.foods.map((food, index) => (
            <div
              key={index}
              className="bg-white/10 rounded-lg p-4 hover-lift transition-all duration-300"
            >
              <div className="text-3xl mb-2">{food.image}</div>
              <h4 className="font-semibold text-white mb-1">{food.name}</h4>
              <p className="text-white/70 text-sm mb-2">{food.description}</p>
              <div className="flex flex-wrap gap-1">
                <span className="inline-block px-2 py-1 bg-white/20 text-white/80 text-xs rounded-full">
                  {food.type}
                </span>
                <span className="inline-block px-2 py-1 bg-blue-500/30 text-white/80 text-xs rounded-full">
                  Mood Booster
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stays Recommendations - Third */}
      <div className="glass rounded-xl p-6 slide-up hover-glow">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          🏨 Stay Recommendations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendations.stays.map((stay, index) => (
            <div
              key={index}
              className="bg-white/10 rounded-lg p-4 hover-lift transition-all duration-300"
            >
              <div className="text-3xl mb-2">{stay.image}</div>
              <h4 className="font-semibold text-white mb-1">{stay.name}</h4>
              <p className="text-white/70 text-sm mb-2">{stay.description}</p>
              <div className="flex flex-wrap gap-1">
                <span className="inline-block px-2 py-1 bg-white/20 text-white/80 text-xs rounded-full">
                  {stay.type}
                </span>
                <span className="inline-block px-2 py-1 bg-green-500/30 text-white/80 text-xs rounded-full">
                  Weather Perfect
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecommendationsSection;
