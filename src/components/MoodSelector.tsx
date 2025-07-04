
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
      color: 'from-orange-400/70 to-orange-500/60',
      bgAccent: 'bg-orange-400/20',
      borderColor: 'border-orange-400/30'
    },
    { 
      value: 'sad', 
      label: 'Sad', 
      emoji: '😢', 
      description: 'Quiet and reflective',
      color: 'from-blue-400/70 to-indigo-500/60',
      bgAccent: 'bg-blue-400/20',
      borderColor: 'border-blue-400/30'
    },
    { 
      value: 'calm', 
      label: 'Calm', 
      emoji: '😌', 
      description: 'Peaceful and serene',
      color: 'from-slate-300/70 to-slate-400/60',
      bgAccent: 'bg-white/25',
      borderColor: 'border-white/30'
    },
    { 
      value: 'cozy', 
      label: 'Cozy', 
      emoji: '🛋️', 
      description: 'Warm and comfortable',
      color: 'from-amber-400/70 to-orange-400/60',
      bgAccent: 'bg-amber-400/20',
      borderColor: 'border-amber-400/30'
    }
  ];

  const selectedMoodData = moods.find(m => m.value === selectedMood);

  return (
    <div className="glass rounded-2xl p-4 sm:p-6 slide-up hover-glow relative overflow-hidden">
      {/* Subtle animated background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 pastel-blue-bg animate-pulse"></div>
      </div>
      
      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
          <h3 className="text-lg sm:text-2xl font-bold text-white flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-gradient-to-r from-orange-400/30 to-amber-400/20 border border-orange-400/25 rounded-lg backdrop-blur-sm neon-orange">
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
              <SelectTrigger className="w-full h-12 sm:h-14 bg-white/15 border-2 border-blue-400/30 text-white hover:bg-white/20 hover:border-orange-400/40 transition-all duration-300 rounded-xl backdrop-blur-md shadow-lg hover:shadow-xl neon-blue">
                <SelectValue placeholder="✨ Choose your current vibe..." className="text-sm sm:text-base" />
              </SelectTrigger>
              <SelectContent className="bg-white/95 backdrop-blur-xl border-slate-200/50 rounded-xl shadow-2xl min-w-[280px] sm:min-w-[300px] z-dropdown">
                {moods.map((mood) => (
                  <SelectItem 
                    key={mood.value} 
                    value={mood.value}
                    className="cursor-pointer hover:bg-blue-50/80 focus:bg-orange-50/80 rounded-lg m-1 p-3 sm:p-4 transition-all duration-200"
                  >
                    <div className="flex items-center space-x-3 sm:space-x-4 w-full">
                      <div className={`w-8 sm:w-12 h-8 sm:h-12 rounded-lg bg-gradient-to-r ${mood.color} flex items-center justify-center text-lg sm:text-xl shadow-lg backdrop-blur-sm flex-shrink-0 border ${mood.borderColor}`}>
                        {mood.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-slate-800 text-sm sm:text-base truncate">{mood.label}</div>
                        <div className="text-xs sm:text-sm text-slate-600 mt-0.5 truncate">{mood.description}</div>
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
            <div className={`p-3 sm:p-4 bg-gradient-to-r ${selectedMoodData?.color} rounded-xl shadow-lg backdrop-blur-sm border ${selectedMoodData?.borderColor} transform hover:scale-105 transition-all duration-300 hover-lift`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="text-xl sm:text-3xl bg-white/25 p-2 rounded-full backdrop-blur-sm flex-shrink-0 border border-white/20">
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
                  className="px-2 sm:px-3 py-1.5 sm:py-2 bg-white/20 hover:bg-orange-400/30 text-white rounded-lg transition-all duration-300 text-xs sm:text-sm font-medium backdrop-blur-sm border border-white/20 hover:border-orange-400/40 ml-2 whitespace-nowrap flex-shrink-0 neon-orange"
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
