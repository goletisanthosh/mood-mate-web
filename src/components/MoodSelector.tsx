
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
      color: 'from-yellow-400 to-orange-400',
      bgAccent: 'bg-yellow-400/20'
    },
    { 
      value: 'sad', 
      label: 'Sad', 
      emoji: '😢', 
      description: 'Quiet and reflective',
      color: 'from-blue-500 to-indigo-500',
      bgAccent: 'bg-blue-400/20'
    },
    { 
      value: 'calm', 
      label: 'Calm', 
      emoji: '😌', 
      description: 'Peaceful and serene',
      color: 'from-green-400 to-teal-400',
      bgAccent: 'bg-green-400/20'
    },
    { 
      value: 'cozy', 
      label: 'Cozy', 
      emoji: '🛋️', 
      description: 'Warm and comfortable',
      color: 'from-orange-400 to-red-400',
      bgAccent: 'bg-orange-400/20'
    }
  ];

  const selectedMoodData = moods.find(m => m.value === selectedMood);

  return (
    <div className="glass rounded-2xl p-8 slide-up hover-glow relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 animate-pulse"></div>
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              🎭
            </div>
            Select Your Mood
          </h3>
          
          {selectedMood && (
            <div className={`px-4 py-2 rounded-full ${selectedMoodData?.bgAccent} border border-white/20 backdrop-blur-sm`}>
              <span className="text-white font-medium flex items-center gap-2">
                <span className="text-xl">{selectedMoodData?.emoji}</span>
                {selectedMoodData?.label}
              </span>
            </div>
          )}
        </div>
        
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
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${mood.color} flex items-center justify-center text-xl shadow-lg`}>
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
          
          {selectedMood && selectedMoodData && (
            <div className={`mt-6 p-6 bg-gradient-to-r ${selectedMoodData.color} rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300`}>
              <div className="flex items-center space-x-4">
                <div className="text-4xl bg-white/20 p-3 rounded-full">
                  {selectedMoodData.emoji}
                </div>
                <div>
                  <h4 className="text-white font-bold text-xl">
                    Current Mood: {selectedMoodData.label}
                  </h4>
                  <p className="text-white/90 text-base mt-1">
                    {selectedMoodData.description}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoodSelector;
