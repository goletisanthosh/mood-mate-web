
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface MoodSelectorProps {
  selectedMood: string;
  onMoodChange: (mood: string) => void;
}

const MoodSelector: React.FC<MoodSelectorProps> = ({ selectedMood, onMoodChange }) => {
  const moods = [
    { value: 'happy', label: 'Happy', emoji: '😊', description: 'Sunny and cheerful' },
    { value: 'sad', label: 'Sad', emoji: '😢', description: 'Rainy and melancholy' },
    { value: 'calm', label: 'Calm', emoji: '😌', description: 'Peaceful and serene' },
    { value: 'cozy', label: 'Cozy', emoji: '🛋️', description: 'Warm and comfortable' }
  ];

  return (
    <div className="glass rounded-xl p-6 slide-up hover-glow">
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
        🎭 Select Your Mood
      </h3>
      
      <div className="space-y-3">
        <p className="text-white/80 text-sm">
          Choose how you're feeling to get personalized recommendations
        </p>
        
        <Select value={selectedMood} onValueChange={onMoodChange}>
          <SelectTrigger className="w-full bg-white/20 border-white/30 text-white hover:bg-white/30 transition-all duration-300">
            <SelectValue placeholder="Select your current mood" />
          </SelectTrigger>
          <SelectContent className="bg-white/95 backdrop-blur-md border-white/30">
            {moods.map((mood) => (
              <SelectItem 
                key={mood.value} 
                value={mood.value}
                className="cursor-pointer hover:bg-white/20 focus:bg-white/20"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{mood.emoji}</span>
                  <div>
                    <div className="font-medium">{mood.label}</div>
                    <div className="text-sm text-gray-600">{mood.description}</div>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {selectedMood && (
          <div className="mt-3 p-3 bg-white/15 rounded-lg border border-white/20">
            <div className="flex items-center space-x-2">
              <span className="text-lg">
                {moods.find(m => m.value === selectedMood)?.emoji}
              </span>
              <span className="text-white font-medium">
                Current mood: {moods.find(m => m.value === selectedMood)?.label}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoodSelector;
