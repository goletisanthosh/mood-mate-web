
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
      color: 'from-orange-300 to-orange-400',
      bgAccent: 'bg-orange-100',
      borderColor: 'border-orange-200'
    },
    { 
      value: 'sad', 
      label: 'Sad', 
      emoji: '😢', 
      description: 'Quiet and reflective',
      color: 'from-blue-300 to-blue-400',
      bgAccent: 'bg-blue-100',
      borderColor: 'border-blue-200'
    },
    { 
      value: 'calm', 
      label: 'Calm', 
      emoji: '😌', 
      description: 'Peaceful and serene',
      color: 'from-gray-200 to-gray-300',
      bgAccent: 'bg-gray-100',
      borderColor: 'border-gray-200'
    },
    { 
      value: 'cozy', 
      label: 'Cozy', 
      emoji: '🛋️', 
      description: 'Warm and comfortable',
      color: 'from-amber-300 to-orange-300',
      bgAccent: 'bg-amber-100',
      borderColor: 'border-amber-200'
    }
  ];

  const selectedMoodData = moods.find(m => m.value === selectedMood);

  return (
    <div className="glass rounded-2xl p-6 slide-up hover-lift">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-400/20 to-orange-400/20 border border-white/20 rounded-lg backdrop-blur-sm">
            🎭
          </div>
          <span>Your Mood</span>
        </h3>
      </div>
      
      {!selectedMood ? (
        <div className="space-y-4">
          <p className="text-white/90 leading-relaxed">
            Choose your mood for personalized recommendations
          </p>
          
          <Select value={selectedMood} onValueChange={onMoodChange}>
            <SelectTrigger className="w-full h-14 bg-white/10 border border-white/20 text-white hover:bg-white/15 transition-all duration-300 rounded-xl backdrop-blur-md">
              <SelectValue placeholder="✨ Choose your current vibe..." />
            </SelectTrigger>
            <SelectContent className="bg-white/95 backdrop-blur-xl border-white/20 rounded-xl shadow-2xl min-w-[300px] z-dropdown">
              {moods.map((mood) => (
                <SelectItem 
                  key={mood.value} 
                  value={mood.value}
                  className="cursor-pointer hover:bg-gray-50 focus:bg-blue-50 rounded-lg m-1 p-4 transition-all duration-200"
                >
                  <div className="flex items-center space-x-4 w-full">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${mood.color} flex items-center justify-center text-xl shadow-md backdrop-blur-sm flex-shrink-0 border ${mood.borderColor}`}>
                      {mood.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-800 truncate">{mood.label}</div>
                      <div className="text-sm text-gray-600 mt-0.5 truncate">{mood.description}</div>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : (
        <div className="space-y-4">
          <div className={`p-4 bg-gradient-to-r ${selectedMoodData?.color} rounded-xl shadow-lg backdrop-blur-sm border ${selectedMoodData?.borderColor} hover-lift`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className="text-3xl bg-white/20 p-2 rounded-full backdrop-blur-sm flex-shrink-0 border border-white/30">
                  {selectedMoodData?.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-bold text-lg truncate">
                    {selectedMoodData?.label} Mood
                  </h4>
                  <p className="text-white/90 text-sm mt-0.5 truncate">
                    {selectedMoodData?.description}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onMoodChange('')}
                className="px-3 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-300 text-sm font-medium backdrop-blur-sm border border-white/30 ml-2 whitespace-nowrap flex-shrink-0"
              >
                Change
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodSelector;
