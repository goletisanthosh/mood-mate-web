import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2 } from 'lucide-react';
import { Song } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface MusicPlayerProps {
  songs: Song[];
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ songs }) => {
  const { t } = useLanguage();
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (songs && songs.length > 0) {
      loadSong(currentSongIndex);
    }
  }, [songs, currentSongIndex]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play()
        .catch(err => {
          console.error("Playback failed:", err);
          setIsPlaying(false);
          setError(t('music.localFile'));
        });
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentSongIndex, t]);

  const loadSong = (index: number) => {
    setIsLoading(true);
    setError(null);
    const song = songs[index];
    if (song && audioRef.current) {
      audioRef.current.src = song.url;
      audioRef.current.load();
      audioRef.current.addEventListener('loadedmetadata', () => {
        setDuration(audioRef.current?.duration || 0);
        setIsLoading(false);
      });
      audioRef.current.addEventListener('error', (e) => {
          console.error("Media error:", e);
          setIsLoading(false);
          setError(song.url.startsWith('blob:') ? t('music.localFile') : t('music.externalLink'));
      });
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex + 1) % songs.length);
  };

  const handlePrevious = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex - 1 + songs.length) % songs.length);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current?.currentTime || 0);
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current?.duration || 0);
    setIsLoading(false);
  };

  const handleSongEnd = () => {
    handleNext();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleSongSelect = (index: number) => {
    setCurrentSongIndex(index);
    setIsPlaying(true);
  };

  const handleError = () => {
    setIsLoading(false);
    setError(t('music.loading'));
  };

  if (!songs || songs.length === 0) {
    return (
      <div className="text-center text-white/70 py-8">
        <div className="text-4xl mb-2">🎵</div>
        <p>{t('recommendations.noMusic').replace('{mood}', 'current')}</p>
      </div>
    );
  }

  const currentSong = songs[currentSongIndex];

  return (
    <div className="space-y-4">
      {/* Current Song Display */}
      <div className="bg-white/10 rounded-lg p-4 border border-white/20">
        <div className="flex items-center space-x-4">
          <div className="text-3xl">{currentSong.image}</div>
          <div className="flex-1">
            <h4 className="font-bold text-white text-lg">{currentSong.title}</h4>
            <p className="text-white/70">{currentSong.artist}</p>
            {error && <p className="text-red-300 text-sm mt-1">{error}</p>}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrevious}
              className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-all duration-300"
              disabled={isLoading}
            >
              <SkipBack size={16} />
            </button>
            <button
              onClick={togglePlayPause}
              className="p-3 bg-white/25 hover:bg-white/35 text-white rounded-full transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : isPlaying ? (
                <Pause size={20} />
              ) : (
                <Play size={20} />
              )}
            </button>
            <button
              onClick={handleNext}
              className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-all duration-300"
              disabled={isLoading}
            >
              <SkipForward size={16} />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-white/60 text-sm">{formatTime(currentTime)}</span>
            <div className="flex-1 bg-white/20 rounded-full h-2 overflow-hidden">
              <div
                className="bg-white/60 h-full transition-all duration-300"
                style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
              />
            </div>
            <span className="text-white/60 text-sm">{formatTime(duration)}</span>
          </div>
          
          {/* Volume Control */}
          <div className="flex items-center space-x-2">
            <Volume2 size={16} className="text-white/60" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              className="flex-1 h-1 bg-white/20 rounded-full appearance-none slider"
            />
          </div>
        </div>
      </div>

      {/* Song List - Fixed hover transform issue */}
      <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
        {songs.map((song, index) => (
          <div
            key={index}
            onClick={() => handleSongSelect(index)}
            className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 border border-transparent ${
              index === currentSongIndex
                ? 'bg-white/25 border-white/30'
                : 'bg-white/10 hover:bg-white/20 hover:border-white/20'
            }`}
            style={{ transform: 'none' }} // Prevent transform issues
          >
            <div className="text-2xl flex-shrink-0">{song.image}</div>
            <div className="flex-1 min-w-0">
              <h5 className="font-medium text-white truncate">{song.title}</h5>
              <p className="text-white/70 text-sm truncate">{song.artist}</p>
            </div>
            <div className="flex-shrink-0">
              {index === currentSongIndex && isPlaying ? (
                <div className="flex items-center space-x-1">
                  <div className="w-1 h-4 bg-white/70 rounded-full animate-pulse"></div>
                  <div className="w-1 h-3 bg-white/70 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-1 h-5 bg-white/70 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
              ) : (
                <Play size={16} className="text-white/50" />
              )}
            </div>
          </div>
        ))}
      </div>

      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleSongEnd}
        onLoadStart={() => setIsLoading(true)}
        onCanPlay={() => setIsLoading(false)}
        onError={handleError}
      />
    </div>
  );
};

export default MusicPlayer;
