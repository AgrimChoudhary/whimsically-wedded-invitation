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
  const [audio] = useState(() => {
    const audioElement = new Audio();
    audioElement.autoplay = true;
    return audioElement;
  });
  const [isPlaying, setIsPlaying] = useState(false);
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
    audio.autoplay = true;
    audio.muted = false;
    
    const initializeAudio = () => {
      if (!isInitialized && !isMusicDisabled) {
        // Start playing automatically
        try {
          const playPromise = audio.play();
          
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                setIsPlaying(true);
                setIsInitialized(true);
                audio.muted = false;
              })
              .catch((error) => {
                console.log("Audio playback failed:", error);
                // Try again with muted (browsers allow muted autoplay)
                audio.muted = true;
                audio.play().then(() => {
                  setIsPlaying(true);
                  setIsInitialized(true);
                  // After a second, try to unmute
                  setTimeout(() => {
                    audio.muted = false;
                  }, 1000);
                }).catch(err => {
                  console.error("Even muted autoplay failed:", err);
                  setIsPlaying(false);
                });
              });
          }
        } catch (error) {
          console.error("Play attempt failed:", error);
        }
      }
    };

    // Multiple event handlers to maximize autoplay chances
    const autoplayEvents = [
      'click', 'touchstart', 'scroll', 'mousedown', 
      'keydown', 'pointerdown', 'pointerup'
    ];
    
    const handleUserInteraction = () => {
      if (!isMusicDisabled) {
        initializeAudio();
        // Remove all event listeners after first interaction
        autoplayEvents.forEach(event => {
          document.removeEventListener(event, handleUserInteraction);
        });
      }
    };

    // Try to play immediately (works on some browsers without interaction)
    initializeAudio();
    
    // Add fallback listeners for browsers that require user interaction
    if (!isMusicDisabled) {
      autoplayEvents.forEach(event => {
        document.addEventListener(event, handleUserInteraction, { once: true });
      });
    }

    // Set multiple timeouts to try again after delays
    const timeouts = [
      setTimeout(() => {
        if (!isInitialized && !isMusicDisabled) initializeAudio();
      }, 1000),
      setTimeout(() => {
        if (!isInitialized && !isMusicDisabled) initializeAudio();
      }, 3000),
      setTimeout(() => {
        if (!isInitialized && !isMusicDisabled) initializeAudio();
      }, 5000)
    ];

    return () => {
      audio.pause();
      autoplayEvents.forEach(event => {
        document.removeEventListener(event, handleUserInteraction);
      });
      timeouts.forEach(timeout => clearTimeout(timeout));
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

  const toggleMusic = () => {
    if (isMusicDisabled) return;
    
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      if (!isInitialized) {
        // If not initialized yet, this is the first play
        setIsInitialized(true);
      }
      audio.muted = false;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(error => {
            console.error("Playback failed:", error);
            // Try with muted as a fallback
            audio.muted = true;
            audio.play().then(() => {
              setIsPlaying(true);
              // Try to unmute after a second
              setTimeout(() => {
                audio.muted = false;
              }, 1000);
            }).catch(err => {
              console.error("Even muted playback failed:", err);
              setIsPlaying(false);
            });
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
