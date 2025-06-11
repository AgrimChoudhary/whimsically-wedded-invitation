import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

interface AudioContextType {
  isPlaying: boolean;
  toggleMusic: () => void;
}

interface AudioProviderProps {
  children: ReactNode;
  isDisabledOnRoutes?: string[];
}

const AudioContext = createContext<AudioContextType>({
  isPlaying: false,
  toggleMusic: () => {},
});

export const AudioProvider: React.FC<AudioProviderProps> = ({ children, isDisabledOnRoutes = [] }) => {
  const [audio] = useState(new Audio());
  const [isPlaying, setIsPlaying] = useState(true); // Start with isPlaying as true
  const [isInitialized, setIsInitialized] = useState(false);
  const location = useLocation();
  
  // Check if current route is in disabled routes list
  const isMusicDisabled = isDisabledOnRoutes.some(route => 
    location.pathname === route || location.pathname.startsWith(`${route}/`)
  );

  // Set up audio on mount
  useEffect(() => {
    // Kudmayi song from Rocky Aur Rani Kii Prem Kahaani
    audio.src = "/audio/Kudmayi.mp3";
    audio.loop = true;
    audio.volume = 0.5;
    audio.preload = "auto";
    
    // Try to play immediately
    const playAudio = async () => {
      if (!isInitialized && !isMusicDisabled) {
        try {
          // Set audio properties for autoplay
          audio.muted = false;
          audio.autoplay = true;
          
          // Try to play
          await audio.play();
          setIsPlaying(true);
          setIsInitialized(true);
        } catch (error) {
          console.log("Initial autoplay failed:", error);
          // If autoplay fails, try again with a slight delay
          setTimeout(() => {
            audio.play().catch(console.error);
          }, 100);
        }
      }
    };

    // Try to play immediately
    playAudio();

    // Try again after a short delay
    const timeoutId = setTimeout(() => {
      if (!isInitialized && !isMusicDisabled) {
        playAudio();
      }
    }, 500);

    return () => {
      audio.pause();
      clearTimeout(timeoutId);
    };
  }, [isInitialized, isMusicDisabled]);

  // Watch for route changes and pause music on disabled routes
  useEffect(() => {
    if (isMusicDisabled) {
      audio.pause();
      setIsPlaying(false);
    } else if (isInitialized && !audio.paused) {
      audio.play().catch(console.error);
      setIsPlaying(true);
    }
  }, [location.pathname, isMusicDisabled]);

  // Try to resume playback when the document becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && isInitialized && !audio.paused && !isMusicDisabled) {
        audio.play().catch(console.error);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isInitialized, audio, isMusicDisabled]);

  const toggleMusic = async () => {
    if (isMusicDisabled) return;
    
    try {
      if (isPlaying) {
        // Instead of pausing, just mute the audio
        audio.muted = true;
        setIsPlaying(false);
      } else {
        // Unmute the audio
        audio.muted = false;
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Error toggling music:", error);
    }
  };

  return (
    <AudioContext.Provider value={{ isPlaying, toggleMusic }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = (): AudioContextType => {
  return useContext(AudioContext);
};
