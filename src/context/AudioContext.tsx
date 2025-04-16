
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface AudioContextType {
  isPlaying: boolean;
  toggleMusic: () => void;
}

const AudioContext = createContext<AudioContextType>({
  isPlaying: false,
  toggleMusic: () => {},
});

export const AudioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [audio] = useState(new Audio());
  const [isPlaying, setIsPlaying] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Set up audio on mount
  useEffect(() => {
    // Updated wedding song URL
    audio.src = "https://pagalfree.com/musics/128-Kudmayi%20(Film%20Version)%20-%20Rocky%20Aur%20Rani%20Kii%20Prem%20Kahaani%20128%20Kbps.mp3";
    audio.loop = true;
    audio.volume = 0.5;
    audio.preload = "auto";
    
    const initializeAudio = () => {
      if (!isInitialized) {
        // Start playing automatically
        audio.play()
          .then(() => {
            setIsPlaying(true);
            setIsInitialized(true);
          })
          .catch((error) => {
            console.log("Audio playback failed:", error);
            setIsPlaying(false);
          });
      }
    };

    // Multiple event handlers to maximize autoplay chances
    const autoplayEvents = ['click', 'touchstart', 'scroll', 'mousedown'];
    
    const handleUserInteraction = () => {
      initializeAudio();
      autoplayEvents.forEach(event => {
        document.removeEventListener(event, handleUserInteraction);
      });
    };

    // Try to play immediately (works on some browsers without interaction)
    initializeAudio();
    
    // Add fallback listeners for browsers that require user interaction
    autoplayEvents.forEach(event => {
      document.addEventListener(event, handleUserInteraction, { once: true });
    });

    // Set a timeout to try again after a delay
    const autoplayTimeout = setTimeout(() => {
      if (!isInitialized) {
        initializeAudio();
      }
    }, 2000);
    
    // Try multiple times to initialize audio
    const audioRetryInterval = setInterval(() => {
      if (!isInitialized) {
        audio.play().then(() => {
          setIsPlaying(true);
          setIsInitialized(true);
          clearInterval(audioRetryInterval);
        }).catch(e => console.log("Retry failed:", e));
      } else {
        clearInterval(audioRetryInterval);
      }
    }, 3000);

    return () => {
      audio.pause();
      autoplayEvents.forEach(event => {
        document.removeEventListener(event, handleUserInteraction);
      });
      clearTimeout(autoplayTimeout);
      clearInterval(audioRetryInterval);
    };
  }, []);

  // Try to resume playback when the document becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && isInitialized) {
        audio.play().catch(console.error);
        setIsPlaying(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Try resuming audio playback periodically when it should be playing
    const resumeInterval = setInterval(() => {
      if (isPlaying && audio.paused) {
        audio.play().catch(e => console.log("Resume failed:", e));
      }
    }, 5000);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(resumeInterval);
    };
  }, [isInitialized, audio, isPlaying]);

  const toggleMusic = () => {
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(console.error);
      setIsPlaying(true);
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
