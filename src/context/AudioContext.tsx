
import React, { createContext, useContext, useEffect, useState, useRef } from 'react';

interface AudioContextType {
  isPlaying: boolean;
  toggleMusic: () => void;
  setIsPlaying: (playing: boolean) => void;
}

const AudioContext = createContext<AudioContextType>({
  isPlaying: true,
  toggleMusic: () => {},
  setIsPlaying: () => {},
});

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioInitialized, setAudioInitialized] = useState(false);

  useEffect(() => {
    // Create audio element only once
    if (!audioRef.current) {
      audioRef.current = new Audio("https://pagalfree.com/musics/128-Kudmayi%20(Film%20Version)%20-%20Rocky%20Aur%20Rani%20Kii%20Prem%20Kahaani%20128%20Kbps.mp3");
      if (audioRef.current) {
        audioRef.current.loop = true;
        audioRef.current.volume = 0.3;
        audioRef.current.preload = "auto";
      }
    }

    // Improved auto-play handling
    const initializeAudio = () => {
      if (audioRef.current && !audioInitialized) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.log("Audio play prevented by browser, will retry on user interaction", error);
          });
        }
        setAudioInitialized(true);
      }
    };
    
    // Try to play audio immediately (may fail due to browser policies)
    initializeAudio();
    
    // Setup user interaction handlers to initialize audio
    const handleUserInteraction = () => {
      initializeAudio();
    };

    // Add event listeners to start audio on first user interaction
    document.addEventListener('click', handleUserInteraction, { once: false });
    document.addEventListener('touchstart', handleUserInteraction, { once: false });
    document.addEventListener('keydown', handleUserInteraction, { once: false });

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      
      // Cleanup audio when component unmounts
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [audioInitialized]);

  // Control audio playback based on isPlaying state
  useEffect(() => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log("Audio play prevented by browser", error);
          // Reset isPlaying if play was prevented
          setIsPlaying(false);
        });
      }
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const toggleMusic = () => {
    setIsPlaying(prevState => !prevState);
  };

  return (
    <AudioContext.Provider value={{ isPlaying, toggleMusic, setIsPlaying }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => useContext(AudioContext);
