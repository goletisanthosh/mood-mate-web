
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
      color: 'from-yellow-300/80 to-orange-300/80',
      bgAccent: 'bg-yellow-300/30'
    },
    { 
      value: 'sad', 
      label: 'Sad', 
      emoji: '😢', 
      description: 'Quiet and reflective',
      color: 'from-blue-300/80 to-indigo-300/80',
      bgAccent: 'bg-blue-300/30'
    },
    { 
      value: 'calm', 
      label: 'Calm', 
      emoji: '😌', 
      description: 'Peaceful and serene',
      color: 'from-green-300/80 to-teal-300/80',
      bgAccent: 'bg-green-300/30'
    },
    { 
      value: 'cozy', 
      label: 'Cozy', 
      emoji: '🛋️', 
      description: 'Warm and comfortable',
      color: 'from-orange-300/80 to-red-300/80',
      bgAccent: 'bg-orange-300/30'
    }
  ];

  const selectedMoodData = moods.find(m => m.value === selectedMood);

  return (
    <div className="glass rounded-2xl p-8 slide-up hover-glow relative overflow-hidden">
      {/* Animated background gradient matching body */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-white/10 animate-pulse"></div>
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              🎭
            </div>
            Select Your Mood
          </h3>
        </div>
        
        {!selectedMood ? (
          <div className="space-y-4">
            <p className="text-white/80 text-base leading-relaxed">
              Choose how you're feeling to get personalized music, food, and stay recommendations
            </p>
            
            <Select value={selectedMood} onValueChange={onMoodChange}>
              <SelectTrigger className="w-full h-14 bg-white/15 border-2 border-white/30 text-white hover:bg-white/25 transition-all duration-300 rounded-xl backdrop-blur-md shadow-lg hover:shadow-xl hover:border-white/50">
                <SelectValue placeholder="✨ Choose your current vibe..." className="text-lg" />
              </SelectTrigger>
              <SelectContent className="bg-white/95 backdrop-blur-xl border-white/30 rounded-xl shadow-2xl min-w-[300px] z-dropdown">
                {moods.map((mood) => (
                  <SelectItem 
                    key={mood.value} 
                    value={mood.value}
                    className="cursor-pointer hover:bg-white/30 focus:bg-white/30 rounded-lg m-1 p-4 transition-all duration-200"
                  >
                    <div className="flex items-center space-x-4 w-full">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${mood.color} flex items-center justify-center text-xl shadow-lg backdrop-blur-sm`}>
                        {mood.emoji}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800 text-lg">{mood.label}</div>
                        <div className="text-sm text-gray-600 mt-1">{mood.description}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Show only selected mood */}
            <div className={`p-6 bg-gradient-to-r ${selectedMoodData?.color} rounded-xl shadow-lg backdrop-blur-sm border border-white/20 transform hover:scale-105 transition-all duration-300`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-4xl bg-white/20 p-3 rounded-full backdrop-blur-sm">
                    {selectedMoodData?.emoji}
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-xl">
                      Current Mood: {selectedMoodData?.label}
                    </h4>
                    <p className="text-white/90 text-base mt-1">
                      {selectedMoodData?.description}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onMoodChange('')}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-300 text-sm font-medium backdrop-blur-sm border border-white/20"
                >
                  Change Mood
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
