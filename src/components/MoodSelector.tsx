
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface MoodSelectorProps {
  selectedMood: string;
  onMoodChange: (mood: string) => void;
}

const MoodSelector: React.FC<MoodSelectorProps> = ({ selectedMood, onMoodChange }) => {
  const moods = [
    { 
      value: 'happy', 
      label: 'Happy', 
      emoji: '😊', 
      description: 'Bright and energetic',
      color: 'from-orange-400/80 to-orange-600/80',
      bgAccent: 'bg-orange-400/30'
    },
    { 
      value: 'sad', 
      label: 'Sad', 
      emoji: '😢', 
      description: 'Quiet and reflective',
      color: 'from-blue-400/80 to-blue-600/80',
      bgAccent: 'bg-blue-400/30'
    },
    { 
      value: 'calm', 
      label: 'Calm', 
      emoji: '😌', 
      description: 'Peaceful and serene',
      color: 'from-white/80 to-gray-300/80',
      bgAccent: 'bg-white/30'
    },
    { 
      value: 'cozy', 
      label: 'Cozy', 
      emoji: '🛋️', 
      description: 'Warm and comfortable',
      color: 'from-orange-500/80 to-orange-700/80',
      bgAccent: 'bg-orange-500/30'
    }
  ];

  const selectedMoodData = moods.find(m => m.value === selectedMood);

  return (
    <div className="glass rounded-2xl p-4 sm:p-6 slide-up hover-glow relative overflow-hidden">
      {/* Animated background gradient with Blue/Orange theme */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-orange-500/5 to-blue-500/10 animate-pulse"></div>
      </div>
      
      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
          <h3 className="text-lg sm:text-2xl font-bold text-white flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-orange-500/30 border border-orange-400/30 rounded-lg backdrop-blur-sm">
              🎭
            </div>
            <span>Your Mood</span>
          </h3>
        </div>
        
        {!selectedMood ? (
          <div className="space-y-3 sm:space-y-4">
            <p className="text-white/90 text-sm sm:text-base leading-relaxed">
              Choose your mood for personalized recommendations
            </p>
            
            <Select value={selectedMood} onValueChange={onMoodChange}>
              <SelectTrigger className="w-full h-12 sm:h-14 bg-white/20 border-2 border-blue-400/40 text-white hover:bg-white/25 hover:border-orange-400/50 transition-all duration-300 rounded-xl backdrop-blur-md shadow-lg hover:shadow-xl">
                <SelectValue placeholder="✨ Choose your current vibe..." className="text-sm sm:text-base" />
              </SelectTrigger>
              <SelectContent className="bg-white/95 backdrop-blur-xl border-blue-400/30 rounded-xl shadow-2xl min-w-[280px] sm:min-w-[300px] z-dropdown">
                {moods.map((mood) => (
                  <SelectItem 
                    key={mood.value} 
                    value={mood.value}
                    className="cursor-pointer hover:bg-blue-100/50 focus:bg-orange-100/50 rounded-lg m-1 p-3 sm:p-4 transition-all duration-200"
                  >
                    <div className="flex items-center space-x-3 sm:space-x-4 w-full">
                      <div className={`w-8 sm:w-12 h-8 sm:h-12 rounded-lg bg-gradient-to-r ${mood.color} flex items-center justify-center text-lg sm:text-xl shadow-lg backdrop-blur-sm flex-shrink-0 border border-white/20`}>
                        {mood.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-800 text-sm sm:text-base truncate">{mood.label}</div>
                        <div className="text-xs sm:text-sm text-gray-600 mt-0.5 truncate">{mood.description}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Show selected mood */}
            <div className={`p-3 sm:p-4 bg-gradient-to-r ${selectedMoodData?.color} rounded-xl shadow-lg backdrop-blur-sm border border-white/30 transform hover:scale-105 transition-all duration-300`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="text-xl sm:text-3xl bg-white/20 p-2 rounded-full backdrop-blur-sm flex-shrink-0 border border-white/20">
                    {selectedMoodData?.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-bold text-sm sm:text-lg truncate">
                      {selectedMoodData?.label} Mood
                    </h4>
                    <p className="text-white/90 text-xs sm:text-sm mt-0.5 truncate">
                      {selectedMoodData?.description}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onMoodChange('')}
                  className="px-2 sm:px-3 py-1.5 sm:py-2 bg-white/20 hover:bg-orange-500/30 text-white rounded-lg transition-all duration-300 text-xs sm:text-sm font-medium backdrop-blur-sm border border-white/20 hover:border-orange-400/40 ml-2 whitespace-nowrap flex-shrink-0"
                >
                  Change
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoodSelector;
