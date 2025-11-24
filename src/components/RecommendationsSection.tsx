
import React from 'react';
import { MoodRecommendations } from '../types';
import MusicPlayer from './MusicPlayer';
import { useLanguage } from '../contexts/LanguageContext';

interface RecommendationsSectionProps {
  recommendations: MoodRecommendations | null;
}

const RecommendationsSection: React.FC<RecommendationsSectionProps> = ({ recommendations }) => {
  const { t } = useLanguage();
  console.log('RecommendationsSection received:', recommendations);

  if (!recommendations) {
    return (
      <div className="bg-white/20 backdrop-blur-md border border-white/30 shadow-xl rounded-xl p-6 text-center">
        <p className="text-gray-800">Get weather data first to see recommendations</p>
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
      {/* Music Recommendations with Player */}
      <div className="bg-white/20 backdrop-blur-md border border-white/30 shadow-xl rounded-xl p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          🎵 Indian Music Recommendations
        </h3>
        <div className="max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
          <MusicPlayer songs={songs} />
        </div>
      </div>
    </div>
  );
};

export default RecommendationsSection;
