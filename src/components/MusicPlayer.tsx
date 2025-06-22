
import React, { useState, useRef } from 'react';
import { MusicRecommendation } from '../types';

interface MusicPlayerProps {
  songs: MusicRecommendation[];
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ songs }) => {
  const [currentSong, setCurrentSong] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePlay = (index: number) => {
    if (currentSong === index && isPlaying) {
      // Pause current song
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    } else {
      // Play new song (demo - using a sample audio URL)
      setCurrentSong(index);
      setIsPlaying(true);
      if (audioRef.current) {
        // For demo purposes, using a sample audio file
        audioRef.current.src = 'https://www.soundjay.com/misc/sounds/magic-chime-02.wav';
        audioRef.current.play().catch(console.error);
      }
    }
  };

  const handleAudioEnd = () => {
    setIsPlaying(false);
    setCurrentSong(null);
  };

  return (
    <div className="space-y-3">
      <audio
        ref={audioRef}
        onEnded={handleAudioEnd}
        onError={() => console.log('Audio playback error')}
      />
      
      {songs.map((song, index) => (
        <div
          key={index}
          className={`bg-white/10 rounded-lg p-4 hover-lift transition-all duration-300 flex items-center space-x-4 ${
            currentSong === index ? 'bg-white/20 border border-white/30' : ''
          }`}
        >
          <button
            onClick={() => handlePlay(index)}
            className="text-2xl hover:scale-110 transition-transform duration-200"
          >
            {currentSong === index && isPlaying ? '⏸️' : '▶️'}
          </button>
          
          <div className="flex-1">
            <h4 className="font-semibold text-white">{song.title}</h4>
            <p className="text-white/70">{song.artist}</p>
            <div className="flex items-center space-x-2 mt-1">
              <span className="inline-block px-2 py-1 bg-white/20 text-white/80 text-xs rounded-full">
                {song.genre}
              </span>
              {currentSong === index && isPlaying && (
                <span className="text-green-400 text-xs animate-pulse">Now Playing</span>
              )}
            </div>
          </div>
          
          {song.spotify_url && (
            <a
              href={song.spotify_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-400 hover:text-green-300 transition-colors"
            >
              🎵
            </a>
          )}
        </div>
      ))}
    </div>
  );
};

export default MusicPlayer;
