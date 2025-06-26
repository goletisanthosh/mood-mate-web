
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
    <div className="space-y-6">
      {/* Enhanced Current Song Display */}
      <div className="relative bg-gradient-to-br from-indigo-500/25 via-purple-500/20 to-pink-500/25 rounded-xl p-6 border border-purple-300/40 backdrop-blur-lg shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-xl"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="text-5xl bg-white/10 p-3 rounded-full border border-white/20">
                  {currentSong.image}
                </div>
                {isPlaying && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse border-2 border-white"></div>
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-white text-xl mb-1">{currentSong.title}</h4>
                <p className="text-white/80 text-lg">{currentSong.artist}</p>
                {error && (
                  <p className="text-red-300 text-sm mt-2 bg-red-500/20 px-3 py-1 rounded-full border border-red-300/30">
                    {error}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handlePrevious}
                className="p-3 bg-white/20 hover:bg-white/30 text-white rounded-full transition-all duration-300 hover:scale-110"
                disabled={isLoading}
              >
                <SkipBack size={18} />
              </button>
              <button
                onClick={togglePlayPause}
                className="p-4 bg-white/30 hover:bg-white/40 text-white rounded-full transition-all duration-300 hover:scale-110 shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : isPlaying ? (
                  <Pause size={24} />
                ) : (
                  <Play size={24} />
                )}
              </button>
              <button
                onClick={handleNext}
                className="p-3 bg-white/20 hover:bg-white/30 text-white rounded-full transition-all duration-300 hover:scale-110"
                disabled={isLoading}
              >
                <SkipForward size={18} />
              </button>
            </div>
          </div>

          {/* Enhanced Progress Bar */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <span className="text-white/70 text-sm font-medium min-w-[40px]">{formatTime(currentTime)}</span>
              <div className="flex-1 bg-white/20 rounded-full h-3 overflow-hidden shadow-inner">
                <div
                  className="bg-gradient-to-r from-blue-400 to-purple-400 h-full transition-all duration-300 shadow-lg"
                  style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
                />
              </div>
              <span className="text-white/70 text-sm font-medium min-w-[40px]">{formatTime(duration)}</span>
            </div>
            
            {/* Enhanced Volume Control */}
            <div className="flex items-center space-x-3">
              <Volume2 size={18} className="text-white/70" />
              <div className="flex-1 bg-white/20 rounded-full h-2 overflow-hidden">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-full h-full appearance-none bg-transparent cursor-pointer slider"
                />
              </div>
              <span className="text-white/60 text-sm min-w-[30px]">{Math.round(volume * 100)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Song List */}
      <div className="space-y-2">
        <h5 className="text-white/80 font-medium mb-3">Playlist</h5>
        <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
          {songs.map((song, index) => (
            <div
              key={index}
              onClick={() => handleSongSelect(index)}
              className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                index === currentSongIndex
                  ? 'bg-white/20 border border-white/30'
                  : 'bg-white/10 hover:bg-white/15 border border-transparent'
              }`}
            >
              <div className="text-2xl">{song.image}</div>
              <div className="flex-1">
                <h5 className="font-medium text-white">{song.title}</h5>
                <p className="text-white/70 text-sm">{song.artist}</p>
              </div>
              <div>
                {index === currentSongIndex && isPlaying ? (
                  <div className="flex items-center space-x-1">
                    <div className="w-1 h-4 bg-blue-400 rounded-full animate-pulse"></div>
                    <div className="w-1 h-3 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-1 h-5 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                ) : (
                  <Play size={16} className="text-white/50" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleSongEnd}
        onLoadStart={() => setIsLoading(true)}
        onCanPlay={() => setIsLoading(false)}
        onError={handleError}
        autoPlay={isPlaying}
      />
    </div>
  );
};

export default MusicPlayer;
