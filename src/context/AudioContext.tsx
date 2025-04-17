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
    // Kudmayi song from Rocky Aur Rani Kii Prem Kahaani
    audio.src = "/audio/Kudmayi.mp3";
    audio.loop = true;
    audio.volume = 0.5;
    audio.preload = "auto";
    
    const initializeAudio = () => {
      if (!isInitialized) {
        // Start playing automatically
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
              setIsInitialized(true);
            })
            .catch((error) => {
              console.log("Audio playback failed:", error);
              setIsPlaying(false);
            });
        }
      }
    };

    // Multiple event handlers to maximize autoplay chances
    const autoplayEvents = [
      'click', 'touchstart', 'scroll', 'mousedown', 
      'keydown', 'pointerdown', 'pointerup'
    ];
    
    const handleUserInteraction = () => {
      initializeAudio();
      // Remove all event listeners after first interaction
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

    // Set multiple timeouts to try again after delays
    const timeouts = [
      setTimeout(() => {
        if (!isInitialized) initializeAudio();
      }, 1000),
      setTimeout(() => {
        if (!isInitialized) initializeAudio();
      }, 3000),
      setTimeout(() => {
        if (!isInitialized) initializeAudio();
      }, 5000)
    ];

    return () => {
      audio.pause();
      autoplayEvents.forEach(event => {
        document.removeEventListener(event, handleUserInteraction);
      });
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  // Try to resume playback when the document becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && isInitialized && !audio.paused) {
        audio.play().catch(console.error);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isInitialized, audio]);

  const toggleMusic = () => {
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(error => {
            console.error("Playback failed:", error);
            setIsPlaying(false);
          });
      }
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
