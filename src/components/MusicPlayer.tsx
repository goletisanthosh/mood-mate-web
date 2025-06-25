import React, { useState, useRef } from 'react';
import { MusicRecommendation } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface MusicPlayerProps {
  songs: MusicRecommendation[];
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ songs }) => {
  const [currentSong, setCurrentSong] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { t } = useLanguage();

  const playNextSong = () => {
    if (currentSong === null) return;
    
    const nextIndex = (currentSong + 1) % songs.length; // Loop back to first song after last
    console.log('Playing next song:', songs[nextIndex].title);
    handlePlay(nextIndex);
  };

  const handlePlay = (index: number) => {
    const song = songs[index];
    console.log('Attempting to play:', song.title, 'URL:', song.spotify_url);
    
    if (currentSong === index && isPlaying) {
      // Pause current song
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    } else {
      // Play new song
      setCurrentSong(index);
      setIsLoading(true);
      
      if (audioRef.current) {
        // Check if it's a local file (starts with /music/ or ./music/)
        let audioSrc = song.spotify_url;
        if (audioSrc.startsWith('./music/') || audioSrc.startsWith('/music/')) {
          // Ensure correct path for local files
          audioSrc = audioSrc.replace('./music/', '/music/');
          console.log('Playing local file:', audioSrc);
        }
        
        audioRef.current.src = audioSrc;
        audioRef.current.load(); // Force reload of the audio source
        
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            setIsLoading(false);
            console.log('Successfully playing:', song.title);
          })
          .catch((error) => {
            console.error('Error playing audio:', error);
            console.error('Failed to play:', audioSrc);
            setIsLoading(false);
            setCurrentSong(null);
            // Fallback to a demo sound for testing
            audioRef.current!.src = 'https://www.soundjay.com/misc/sounds/magic-chime-02.wav';
            audioRef.current!.play().catch(console.error);
          });
      }
    }
  };

  const handleAudioEnd = () => {
    // Automatically play next song when current song ends
    playNextSong();
  };

  const handleAudioError = (error: any) => {
    console.error('Audio error:', error);
    setIsLoading(false);
    setIsPlaying(false);
    setCurrentSong(null);
  };

  return (
    <div className="space-y-3">
      <audio
        ref={audioRef}
        onEnded={handleAudioEnd}
        onError={handleAudioError}
        onCanPlay={() => setIsLoading(false)}
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
            disabled={isLoading && currentSong === index}
          >
            {isLoading && currentSong === index ? '⏳' : 
             currentSong === index && isPlaying ? '⏸️' : '▶️'}
          </button>
          
          <div className="flex-1">
            <h4 className="font-semibold text-white">{song.title}</h4>
            <p className="text-white/70">{song.artist}</p>
            <div className="flex items-center space-x-2 mt-1">
              <span className="inline-block px-2 py-1 bg-white/20 text-white/80 text-xs rounded-full">
                {song.genre}
              </span>
              {currentSong === index && isPlaying && (
                <span className="text-green-400 text-xs animate-pulse">{t('music.nowPlaying')}</span>
              )}
              {isLoading && currentSong === index && (
                <span className="text-yellow-400 text-xs animate-pulse">{t('music.loading')}</span>
              )}
            </div>
            <div className="text-xs text-white/50 mt-1">
              {song.spotify_url && (song.spotify_url.startsWith('/music/') || song.spotify_url.startsWith('./music/')) ? 
                t('music.localFile') : t('music.externalLink')}
            </div>
          </div>
          
          {song.spotify_url && !song.spotify_url.startsWith('/music/') && !song.spotify_url.startsWith('./music/') && (
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
