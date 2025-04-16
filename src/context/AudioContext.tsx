
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
    // Wedding song from the movie "Rocky Aur Rani Kii Prem Kahaani"
    audio.src = "https://pagalsong.in/uploads/systemuploads/mp3/Tum%20Kya%20Mile/Tum%20Kya%20Mile%20128%20Kbps.mp3";
    audio.loop = true;
    audio.volume = 0.5;
    
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

    // Wait for user interaction to initialize audio
    const handleUserInteraction = () => {
      initializeAudio();
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };

    // Try to play immediately (works on some browsers without interaction)
    initializeAudio();
    
    // Add fallback listeners for browsers that require user interaction
    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);

    return () => {
      audio.pause();
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
  }, []);

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
